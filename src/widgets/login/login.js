(() => {
  function notification(type, headline, body) {
    return {
      type: 'NOTIFY',
      value: {
        notification: {
          type,
          headline,
          body,
        },
      },
    };
  }

  function errorAction(errors, { username, password } = {}) {
    return {
      type: 'ERROR',
      value: { errors, username, password },
    };
  }

  function errorNotificationAction(headline, body) {
    return notification('error', headline, body);
  }

  function successAction(headline, body) {
    return notification('success', headline, body);
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'SET_INITIAL_DATA': {
        const username = action.value.username;
        return Object.assign({}, state, {
          username,
        });
      }
      case 'ERROR': {
        const { errors, username, password } = action.value;
        const reset = {
          username_message: '',
          password_message: '',
          username,
          password,
        };
        const newState = Object.assign({}, state, reset);
        const error = errors[0];
        if (error.field) {
          // TODO: On password hint change the Password-forget link will be replaced
          newState.notification = null;
          newState[`${error.field}_message`] = error.text;
        } else {
          newState.notification = {
            type: 'error',
            headline: 'Anmeldungs-Fehler',
            body: error.text,
          };
        }
        return newState;
      }
      case 'NOTIFY':
        return Object.assign({}, state, action.value);
      default:
        return state;
    }
  }

  let username;
  if (typeof window.URL === 'function') {
    const url = new URL(window.location);
    username = url.searchParams.get('login');
  } else {
    username = location.search.split('login=').pop().split('&').shift();
  }

  /**
   * Returns true if given url is allowed to be redirected to.
   * @param url Absolute url
   */
  function isAllowedUrl(url) {
    const link = document.createElement('a');

    link.setAttribute('href', url);

    const currentHostName = window.location.hostname;
    const targetHostName = link.href.replace(/^https?:\/\/([^/]+)[\w\W]+$/, '$1');
    const targetDomain = targetHostName
      .toLowerCase()
      .split('.')
      .slice(targetHostName.toLowerCase().split('.').slice(-2)[0] === 'co' ? -3 : -2)
      .join('.');
    const currentDomain = currentHostName
      .toLowerCase()
      .split('.')
      .slice(currentHostName.toLowerCase().split('.').slice(-2)[0] === 'co' ? -3 : -2)
      .join('.');

    return targetDomain === currentDomain;
  }


  window.park.app({
    container: 'login',
    component: 'login',
    reducer,
  }).then((app) => {
    app.store.dispatch({
      type: 'SET_INITIAL_DATA',
      value: {
        username,
      },
    });
    function handlesubmission(form) {
      const data = new FormData(form);
      const fields = {
        username: data.get('username'),
        password: data.get('password'),
      };

      let oauthConfig = {};
      const oauthJson = window.park.$('.park-login')[0].getAttribute('data-oauth');
      if (oauthJson) {
        oauthConfig = JSON.parse(oauthJson);
        data.append('oauth_scope', oauthConfig.oauth_scope);
      }

      const recaptcha = form.querySelector('.park-recaptcha');
      if (recaptcha) {
        const recaptchaResponse = recaptcha.getAttribute('g-response');
        if (recaptchaResponse) {
          data.append('captcha-response', recaptchaResponse);
        }
      }

      window.park.api.login(data).then((result) => {
        if (result.errors) {
          app.store.dispatch(errorAction(result.errors, fields));
          return;
        }

        if (result.showOptin) {
          window.park.storage.set('park.opt_in', result.data);
          window.location.href = '/sso/opt-in-layer';
          return;
        }

        window.park.user.setUser(result.user);
        window.park.user.login();

        window.park.api.getUserPreferences().then((preferences) => {
          window.park.user.setPreferences(preferences);
          let redirectUrl = '/';

          if (window.park.cookie.get('redirect_after_login')) {
            redirectUrl = decodeURIComponent(window.park.cookie.get('redirect_after_login'));
            if (document.location.hostname.includes('wz.de') && redirectUrl.includes('wz.de')) {
              const url = new URL(redirectUrl);
              url.searchParams.append('no_cache', Date.now());
              redirectUrl = url.toString();
            }
            window.park.cookie.set('redirect_after_login', '', -1);
          }

          const loginReferrer = window.park.storage.get('park.login.referrer');

          if (window.park.exports.config.consentRedirectUrl && !loginReferrer) {
            redirectUrl = window.park.storage.get('park.consent.referrer') ? window.park.storage.get('park.consent.referrer') : '/';
          }

          redirectUrl = `${redirectUrl.split('#')[0]}#successLogin`;

          if (result.user.oauth_token) {
            window.park.console.log(`${oauthConfig.oauth_redirect_uri}#access_token=${result.user.oauth_token}&token_type=bearer&state=${oauthConfig.oauth_state}`);
            window.location.href = `${oauthConfig.oauth_redirect_uri}#access_token=${result.user.oauth_token}&token_type=bearer&state=${oauthConfig.oauth_state}`;
            return;
          }

          if (isAllowedUrl(redirectUrl)) {
            window.location.href = redirectUrl;
          } else {
            window.park.console.error('error', `Die Umleitungs-URL '${redirectUrl}' ist nicht erlaubt.`);
            window.location.href = '/#successLogin';
          }
        });
      }).catch((errors) => {
        window.park.console.error('error', errors);
        app.store.dispatch(errorNotificationAction('Anmeldungs Fehler', 'Es ist leider ein Server-Fehler aufgetreten.', fields));
      });
    }

    app.bindEvent('submit', '.park-form', (e) => {
      const form = e.target;

      const recaptcha = form.querySelector('.park-recaptcha');
      if (recaptcha) {
        form.submit = (realsubmit) => {
          if (!realsubmit) {
            return;
          }
          handlesubmission(form);
        };
        window.park.console.log('capture recaptcha');
        const recaptchaResponse = recaptcha.getAttribute('g-response');
        const recaptchaChallenge = recaptcha.querySelector('.g-recaptcha').getAttribute('data-size');
        if (recaptchaChallenge === 'invisible' && !recaptchaResponse) {
          window.park.console.log('capture invisible recaptcha');
          window.grecaptcha.execute();
          e.preventDefault();
          return;
        }
      }
      handlesubmission(form);
      e.preventDefault();
    });

    // Check the referer
    if (document.referrer && window.location.hostname === document.referrer.split('/')[2]) {
      if (document.referrer.indexOf('aid') > -1 || document.referrer.indexOf('bid') > -1 || document.referrer.indexOf('iid') > -1 || document.referrer.indexOf('vid') > -1) {
        window.park.storage.set('park.login.referrer', document.referrer);
      } else {
        window.park.storage.remove('park.login.referrer');
      }
    } else {
      window.park.storage.remove('park.login.referrer');
    }

    function checkForNotifications() {
      switch (window.location.hash) {
        case '#emailVerified' : // TODO: This is not only registration but also email-change-verification
          app.store.dispatch(successAction('Registrierung erfolgreich', 'Die Aktivierung Ihres Kontos war erfolgreich. Sie können sich jetzt anmelden.'));
          break;
        case '#noHash' :
          app.store.dispatch(errorNotificationAction('Validierungsfehler', 'Es wurde kein Hash übermittelt.'));
          break;
        case '#invalidHash' :
          app.store.dispatch(errorNotificationAction('Validierungsfehler', 'Der Verifizierungs-Code ist falsch.'));
          break;
        case '#expiredHash' :
          app.store.dispatch(errorNotificationAction('Validierungsfehler', 'Leider ist die Bestätigungszeit abgelaufen. Sie erhalten eine neue E-Mail.'));
          break;
        case '#alreadyConfirmedHash' :
          app.store.dispatch(errorNotificationAction('Validierungsfehler', 'Ihre E-Mail ist schon bestätigt worden.'));
          break;
        case '#notLoggedInForBookmarks' :
        case '#notLoggedInForSettings' :
        case '#notLoggedInForOptOut' :
        case '#notLoggedInForProfile' :
          app.store.dispatch(errorNotificationAction('Anmeldung nötig', 'Für diese Aktion müssen Sie angemeldet sein.'));
          break;
        default:
          break;
      }
    }

    window.addEventListener('hashchange', checkForNotifications);

    checkForNotifications();
  });
})();
