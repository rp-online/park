(() => {
  function errorAction(errors) {
    return {
      type: 'ERROR',
      value: errors,
    };
  }

  function mapFormDataToState(formData) {
    const newState = {
      // Reset Checkboxes
      accepted_agbs: '',
      optin: '',
      optin_tracking: '',
    };
    const entries = formData.entries();
    let entry = entries.next();
    while (!entry.done) {
      const [key, value] = entry.value;
      newState[key] = value;

      entry = entries.next();
    }
    return newState;
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

  function reducer(state, action) {
    switch (action.type) {
      case 'ERROR': {
        const reset = {
          email_message: '',
          username_message: '',
          password_message: '',
        };
        const newState = Object.assign({}, state, reset);
        const error = action.value[0];

        if (error.field) {
          newState[`${error.field}_message`] = error.text;
        }

        newState.notification = {
          type: 'error',
          headline: 'Fehler',
          body: error.text,
        };
        return newState;
      }
      case 'UPDATE_FORM': {
        window.park.console.log('updateform');
        const form = action.value;
        const newState = mapFormDataToState(form);
        newState.notification = null;
        return Object.assign({}, state, newState);
      }
      default:
        return state;
    }
  }

  window.park.app({
    container: 'register',
    component: 'registration',
    reducer,
  }).then((app) => {
    function handlesubmission(form) {
      const data = new FormData(form);
      const recaptcha = form.querySelector('.park-recaptcha');
      if (recaptcha) {
        const recaptchaResponse = recaptcha.getAttribute('g-response');
        if (recaptchaResponse) {
          data.append('captcha-response', recaptchaResponse);
        }
      }
      window.park.api.register(data).then((result) => {
        if (result.errors) {
          throw result;
        }
        const target = app.elems[0];
        const parent = target.parentElement;

        if (result.redirect) {
          let redirectUrl = '/';
          if (window.park.cookie.get('redirect_after_login')) {
            redirectUrl = decodeURIComponent(window.park.cookie.get('redirect_after_login'));
            window.park.cookie.set('redirect_after_login', '', -1);
          }
          redirectUrl = redirectUrl.split('?forceReduced=true')[0];
          redirectUrl = `${redirectUrl.split('#')[0]}#successRegister`;
          if (isAllowedUrl(redirectUrl)) {
            window.location.href = redirectUrl;
          } else {
            window.park.console.error('error', `Die Umleitungs-URL '${redirectUrl}' ist nicht erlaubt.`);
            window.location.href = '/#successRegister';
          }
        } else {
          location.hash = '#successRegister';
          window.park.widgets.replace({
            type: 'notification',
            initialState: {
              headline: 'Vielen Dank für Ihre Registrierung',
              body: 'Wir haben Ihnen soeben eine E-Mail geschickt. Bitte bestätigen Sie Ihre Angaben durch Klick auf den enthaltenen Link. Sollten Sie die E-Mail nicht erhalten haben, schauen Sie bitte auch in Ihrem Spam-Ordner nach.',
              type: 'success',
            },
          }, target);
          parent.classList.add('park-section--narrow');
        }
      }).catch((result) => {
        app.store.dispatch({
          type: 'UPDATE_FORM',
          value: data,
        });
        window.park.console.error('error', result);
        app.store.dispatch(errorAction(result.errors));
      });
    }

    // If this is a Facebook Callback URL get rid of the Facebook Data
    const isCallbackRegex = /state/gi;
    if (isCallbackRegex.test(location.search)) {
      history.replaceState({ register: true }, document.title, '/sso/register');
    }

    app.bindEvent('change', '.park-form [type="checkbox"]', (e) => {
      const form = e.target.closest('.park-form');
      const data = new FormData(form);

      app.store.dispatch({
        type: 'UPDATE_FORM',
        value: data,
      });
    });

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
  });
})();
