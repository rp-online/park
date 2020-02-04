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
    container: 'notification-panel',
    component: 'notification-panel',
    reducer,
  }).then((app) => {
    let updateTimer = null;
    const update = () => {
      window.clearTimeout(updateTimer);
      updateTimer = window.setTimeout(() => {
        const elem = document.getElementById('park-notification-panel');
        const data = {
          config: window.park.exports.config,
          hasSubscribed: !!(window.park.storage.get('park.user.subscriptionsCount') || 0),
          items: (window.park.storage.get('park.user.subscriptionsCount') || 0) ? (window.park.storage.get('park.user.subscriptionsUnread', true) || []) : [],
          visible: elem && !elem.getAttribute('aria-hidden'),
        };

        app.store.dispatch({
          type: 'UPDATE',
          value: data,
        });
      }, 50);
    };

    window.addEventListener('storage', update);
    document.addEventListener('park.user:authchange', update);

    update();
  });
})();
