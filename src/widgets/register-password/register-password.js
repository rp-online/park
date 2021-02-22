(() => {
  function errorAction(headline, body) {
    return {
      type: 'ERROR',
      value: {
        headline,
        body,
      },
    };
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'SET_INITIAL_DATA': {
        const form = state.form;
        form.username = action.value.username;
        form.hash = action.value.hash;
        return Object.assign({}, state, {
          form,
        });
      }
      case 'ERROR': {
        return Object.assign({}, state, {
          notification: {
            type: 'error',
            headline: action.value.headline,
            body: action.value.body,
          },
        });
      }
      default:
        return state;
    }
  }

  let hash;
  let username;
  if (typeof window.URL === 'function') {
    const url = new URL(window.location);
    hash = url.searchParams.get('h');
    username = url.searchParams.get('login');
  } else {
    hash = location.search.split('h=').pop().split('&').shift();
    username = location.search.split('login=').pop().split('&').shift();
  }

  window.park.app({
    container: 'register-password',
    component: 'register-password',
    reducer,
  }).then((app) => {
    app.store.dispatch({
      type: 'SET_INITIAL_DATA',
      value: {
        hash,
        username,
      },
    });

    function handlesubmission(form) {
      const data = new FormData(form);

      window.park.api.login(data).then((result) => {
        if (result.errors) {
          throw result;
        }

        window.park.user.setUser(result.user);
        window.park.user.login();

        window.park.api.getUserPreferences().then((preferences) => {
          window.park.user.setPreferences(preferences);

          const oauth = window.park.$('.park-register-password')[0].getAttribute('data-oauth');
          window.location.href = `${oauth.split('#')[0]}#successLogin`;
        });
      }).catch((result) => {
        app.store.dispatch(errorAction('Anmeldungs Fehler', result.errors[0].text));
      });
    }

    if (hash == null || username == null) {
      app.store.dispatch(errorAction('Fehlerhafter Link', ''));
      return;
    }

    app.bindEvent('submit', '.park-form', (e) => {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);

      window.park.api.changePassword(data).then((result) => {
        if (result.errors) {
          throw result;
        }
        handlesubmission(form);
      }).catch((result) => {
        app.store.dispatch(errorAction('Fehler beim Passwort ändern', result.errors[0].text));
      });
    });
  });
})();
