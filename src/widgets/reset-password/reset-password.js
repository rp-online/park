(() => {
  function errorAction(message, email) {
    return {
      type: 'ERROR',
      value: {
        message,
        email,
      },
    };
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'ERROR': {
        const form = state.form;
        form.validationMessage = action.value.message;
        form.email = action.value.email;
        return Object.assign({}, state, {
          form,
        });
      }
      default:
        return state;
    }
  }

  window.park.app({
    container: 'reset-password',
    component: 'reset-password',
    reducer,
  }).then((app) => {
    function handlesubmission(form) {
      const data = new FormData(form);
      const email = data.get('email');
      const recaptcha = form.querySelector('.park-recaptcha');
      if (recaptcha) {
        const recaptchaResponse = recaptcha.getAttribute('g-response');
        if (recaptchaResponse) {
          data.append('captcha-response', recaptchaResponse);
        }
      }

      window.park.api.resetPassword(data).then((result) => {
        if (result.errors) {
          throw result;
        } else {
          const target = app.elems[0];
          window.park.widgets.replace({
            type: 'notification',
            initialState: {
              headline: 'Passwortänderung',
              body: 'Wir haben Ihnen eine E-Mail mit einem Link zur Passwortänderung zugesendet.',
              type: 'success',
            },
          }, target);
        }
      }).catch((result) => {
        window.park.console.error('error', result);
        app.store.dispatch(errorAction(result.errors[0].text, email));
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
  });
})();
