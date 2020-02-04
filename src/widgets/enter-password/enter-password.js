(() => {
  function reducer(state, action) {
    switch (action.type) {
      case 'ERROR': return Object.assign({}, state, {
        notification: action.value.notification,
      });
      default:
        return state;
    }
  }

  function handleEnterPassword(app, data) {
    window.park.api.currentUser(data).then((result) => {
      if (result.errors) {
        throw result;
      }
      const initialState = Object.assign({}, result.data, {
        password: data.get('password'),
      });
      const target = app.elems[0];
      const parent = target.parentElement;
      window.park.widgets.replace({
        type: 'edit-profile',
        initialState,
      }, target);
      parent.classList.remove('park-section--narrow');
    }).catch((result) => {
      app.store.dispatch({
        type: 'ERROR',
        value: {
          notification: {
            type: 'error',
            headline: 'Verifizierungs-Fehler',
            body: result.errors[0].text,
          },
        },
      });
      window.park.console.error('error', result);
    });
  }

  window.park.app({
    container: 'enter-password',
    component: 'enter-password',
    reducer,
  }).then((app) => {
    app.bindEvent('submit', '.park-form', (e) => {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);
      handleEnterPassword(app, data);
    });
  });
})();
