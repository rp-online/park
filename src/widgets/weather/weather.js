(() => {
  function reducer(state, action) {
    switch (action.type) {
      case 'UPDATE':
        state = action.value;
        break;

      default:
        break;
    }
    return state;
  }

  window.park.app({
    container: 'weather',
    component: 'slider',
    reducer,
  }).then((app) => {
    const state = app.store.getState();
    const initialState = JSON.parse(JSON.stringify(state));
    const baseUrl = state.ajax && state.ajax.baseUrl ? state.ajax.baseUrl : undefined;
    const defaultRegion = state.ajax && state.ajax.defaultRegion
      ? state.ajax.defaultRegion : undefined;

    const fetch = region => (baseUrl ? window.park.ajax(`${window.park.exports.config.rootBase}${baseUrl}${region}`) : new Promise(resolve => resolve({})))
      .then(result => result.json());

    const update = () => {
      window.park.user.getWeatherRegion()
        .then((userRegion) => {
          const weatherRegion = userRegion || defaultRegion;
          window.park.console.log(baseUrl, weatherRegion);

          if (!baseUrl) {
            return;
          }

          if (window.park.user.isLoggedIn()) {
            fetch(weatherRegion)
              .then((result) => {
                app.store.dispatch({
                  type: 'UPDATE',
                  value: result,
                });
              })
              .catch(() => {
                window.park.console.info('Weather widget is unable to fetch weather data');
              });
            return;
          }

          if (!initialState.items) {
            fetch(defaultRegion)
              .then((result) => {
                app.store.dispatch({
                  type: 'UPDATE',
                  value: result,
                });
              })
              .catch(() => {
                window.park.console.info('Weather widget is unable to fetch weather data');
              });
            return;
          }

          app.store.dispatch({
            type: 'UPDATE',
            value: initialState,
          });
        })
        .catch(() => {
          window.park.console.info('Weather widget is unable to get the user\'s preferred city');
        });
    };

    document.addEventListener('park.user:authchange', () => {
      window.setTimeout(update);
    });

    if (window.park.user.isLoggedIn() || !initialState.items) {
      update();
    }
  });
})();
