(() => {
  function errorAction(message) {
    return {
      type: 'ERROR',
      value: message,
    };
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'ERROR': {
        return Object.assign({}, state, {
          notification: {
            type: 'error',
            headline: 'Fehler beim Setzten des Opt-Ins:',
            body: action.value,
          },
        });
      }
      default:
        return state;
    }
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
    container: 'opt-in-layer',
    component: 'opt-in-layer',
    reducer,
  }).then((app) => {
    function handlesubmission(data) {
      window.park.api.handleLoginAfterOptin(data).then((result) => {
        if (result.errors) {
          app.store.dispatch(errorAction('Bitte melden Sie sich an'));
          return;
        }
        window.park.user.setUser(result.user);
        window.park.user.login();

        window.park.api.getUserPreferences().then((preferences) => {
          window.park.user.setPreferences(preferences);
          let redirectUrl = '/';

          if (window.park.cookie.get('redirect_after_login')) {
            redirectUrl = decodeURIComponent(window.park.cookie.get('redirect_after_login'));
            window.park.cookie.set('redirect_after_login', '', -1);
          }

          const loginReferrer = window.park.storage.get('park.login.referrer');

          if (window.park.exports.config.consentRedirectUrl && !loginReferrer) {
            redirectUrl = window.park.storage.get('park.consent.referrer') ? window.park.storage.get('park.consent.referrer') : '/';
          }

          redirectUrl = `${redirectUrl.split('#')[0]}#successLogin`;

          if (isAllowedUrl(redirectUrl)) {
            window.location.href = redirectUrl;
          } else {
            window.park.console.error('error', `Die Umleitungs-URL '${redirectUrl}' ist nicht erlaubt.`);
            window.location.href = '/#successLogin';
          }
        });
      });
    }

    app.bindEvent('click', '.park-button--style-submit', () => {
      const data = window.park.storage.get('park.opt_in');

      if (data.username !== undefined && data.password !== undefined) {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('password', data.password);

        window.park.api.setOptIn(formData).then((result) => {
          if (result.errors) {
            app.store.dispatch(errorAction('Bitte melden Sie sich an'));
            return;
          }
          handlesubmission(formData);
        });
      } else {
        app.store.dispatch(errorAction('Bitte melden Sie sich an'));
      }
    });
  });
})();
