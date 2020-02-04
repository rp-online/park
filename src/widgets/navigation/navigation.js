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
    container: 'navigation',
    component: 'navigation',
    reducer,
  }).then((app) => {
    const state = app.store.getState();
    const url = state.ajax.url;
    const fetch = () => window.park.ajax(`${window.park.exports.config.rootBase}${url}`);

    fetch()
      .then((result) => {
        result
          .json()
          .then((result) => {
            app.store.dispatch({
              type: 'UPDATE',
              value: result,
            });
            console.info('Navigation fetch returned JSON');
          })
          .catch(() => {
            result.text().then((result) => {
              app.insertHTML(result);
              console.info('Navigation fetch returned HTML');
            });
          });
      });
  });
})();
