import initialState from './data.json';

(() => {
  function reducer(state, action) {
    switch (action.type) {
      case 'UPDATE':
        state.username = action.value;
        state.password = action.value;
        state.stay_logged_in = !!action.value.trim();
        break;

      default:
        break;
    }
    return state;
  }

  window.park.app({
    container: 'sample',
    component: 'sample',
    reducer,
    initialState,
  }).then((app) => {
    app.bindEvent('input', 'input[name]', (e) => {
      switch (e.target.name) {
        default:
          break;

        case 'username':
        case 'password':
          app.store.dispatch({
            type: 'UPDATE',
            value: e.target.parkValue || e.target.value,
          });
          break;
      }
    });
  });
})();
