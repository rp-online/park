(() => {
  function errorAction(message, login) {
    return {
      type: 'ERROR',
      value: {
        message,
        login,
      },
    };
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'ERROR': {
        const form = state.form;
        form.validationMessage = action.value.message;
        form.login = action.value.login;
        return Object.assign({}, state, {
          form,
        });
      }
      default:
        return state;
    }
  }

  window.park.app({
    container: 'new-validation-email',
    component: 'new-validation-email',
    reducer,
  }).then((app) => {
    app.bindEvent('submit', '.park-form', (e) => {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);
      const login = data.get('login');

      window.park.api.newValidationEmail(data).then((result) => {
        if (result.errors) {
          throw result;
        } else {
          const target = app.elems[0];
          window.park.widgets.replace({
            type: 'notification',
            initialState: {
              headline: 'Neue E-Mail',
              body: 'Wir haben Ihnen eine neue E-Mail mit dem Link zur Bestätigung zugesendet.',
              type: 'success',
            },
          }, target);
        }
      }).catch((result) => {
        console.error('error', result);
        app.store.dispatch(errorAction(result.errors[0].text, login));
      });
    });
  });
})();
