(() => {
  function reducer(state, action) {
    switch (action.type) {
      case 'UPDATE_FORM': {
        const newState = Object.assign({}, state);
        newState.notification = action.value;
        newState.weather.place.value = (action.data.weather) ? action.data.weather : '';
        newState.traffic.highways.value = (action.data.highways) ? action.data.highways : [];
        newState.quickNav.cities.value = (action.data.cities) ?
          action.data.cities.map(a => a.id) : [];
        newState.quickNav.sportsclubs.value = (action.data.sportsclubs) ?
          action.data.sportsclubs.map(a => a.id) : [];
        return newState;
      }
      default:
        return state;
    }
  }

  function updateLocalPreferences(result) {
    const data = result.data;
    window.park.user.setPreferences(data);
  }

  window.park.app({
    container: 'personal-area',
    component: 'section',
    reducer,
  }).then((app) => {
    app.bindEvent('submit', 'form', (e) => {
      const form = e.target;
      const data = new FormData(form);

      window.park.api.setUserPreferences(data)
        .then((result) => {
          if (result.errors) {
            window.park.user.logout(true);
            throw result;
          }

          app.store.dispatch({
            type: 'UPDATE_FORM',
            data: result.data,
            value: {
              type: 'success',
              headline: 'Einstellung gespeichert',
              body: 'Ihre Einstellungen sind erfolgreich aktualisiert worden.',
            },
          });
          return result;
        }).then(updateLocalPreferences)
        .catch(window.park.console.error.bind(console));


      e.preventDefault();
      return false;
      // TODO: We do not need to update below
      // const key = e.target.name;
      // let value = data.getAll(key);
      // if (key === 'weather') {
      //   value = value[0];
      // }
      // app.store.dispatch({
      //   type: 'UPDATE_FIELD',
      //   value: {
      //     key,
      //     value,
      //   },
      // });
    });
  });
})();
