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
    container: 'enlargable-overlay',
    component: 'overlay',
    reducer,
  }).then((app) => {
    document.addEventListener('park.enlargable:change', (e) => {
      app.store.dispatch({
        type: 'UPDATE',
        value: e.detail,
      });
    });
  });
})();
