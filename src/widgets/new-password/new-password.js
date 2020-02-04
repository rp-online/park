(() => {
  function errorAction(message) {
    return {
      type: 'ERROR',
      value: message,
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
            headline: 'Fehler beim Passwort ändern',
            body: action.value,
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
    container: 'new-password',
    component: 'new-password',
    reducer,
  }).then((app) => {
    app.store.dispatch({
      type: 'SET_INITIAL_DATA',
      value: {
        hash,
        username,
      },
    });

    app.bindEvent('submit', '.park-form', (e) => {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);

      window.park.api.changePassword(data).then((result) => {
        if (result.errors) {
          throw result;
        }

        const target = app.elems[0];
        window.park.widgets.replace({
          type: 'notification',
          initialState: {
            headline: 'Passwort erfolgreich geändert',
            body: 'Sie können sich jetzt mit Ihrem neuen Passwort einloggen.',
            type: 'success',
          },
        }, target);
      }).catch((result) => {
        window.park.console.error('error', result);
        app.store.dispatch(errorAction(result.errors[0].text));
      });
    });
  });
})();
