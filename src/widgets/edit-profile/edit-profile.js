(() => {
  function mapFormDataToState(formData) {
    const newState = {};
    const entries = formData.entries();
    let entry = entries.next();
    while (!entry.done) {
      const [key, value] = entry.value;
      newState[key] = value;

      entry = entries.next();
    }
    return newState;
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'NOTIFY': {
        const newState = Object.assign({}, state);
        newState.notification = action.value;
        return newState;
      }
      case 'UPDATE_FORM': {
        const form = action.value;
        const newData = mapFormDataToState(form);
        return Object.assign({}, newData);
      }
      case 'ERROR': {
        const value = action.value;
        const newState = Object.assign({}, state);
        newState.notification = value.notification;
        return newState;
      }
      default:
        return state;
    }
  }

  function handleChangeProfile(app, data) {
    app.store.dispatch({
      type: 'UPDATE_FORM',
      value: data,
    });
    window.park.api.changeProfile(data).then((result) => {
      if (result.errors) {
        throw result;
      }

      app.store.dispatch({
        type: 'NOTIFY',
        value: {
          type: 'success',
          headline: 'Erfolg',
          body: result.text,
        },
      });
    }).catch((result) => {
      console.error('error', result);
      app.store.dispatch({
        type: 'ERROR',
        value: {
          notification: {
            type: 'error',
            headline: 'Bearbeitungs-Fehler',
            body: result.errors[0].text,
          },
        },
      });
    });
  }

  window.park.app({
    container: 'edit-profile',
    component: 'edit-profile',
    reducer,
  }).then((app) => {
    app.bindEvent('submit', '.park-form', (e) => {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);
      handleChangeProfile(app, data);
    });
  });
})();
