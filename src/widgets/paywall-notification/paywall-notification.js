(() => {
  window.park.app({
    container: 'paywall-notification',
    component: 'snackbar-paywall',
  }).then((app) => {
    app.bindEvent('park.widget:rendered', () => {
      window.park.snackbarManager.open('paywall');
    });
  });
})();
