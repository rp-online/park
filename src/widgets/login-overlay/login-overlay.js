(() => {
  window.park.app({
    container: 'login-overlay',
    component: 'overlay',
  }).then((app) => {
    app.bindEvent('load', 'iframe', () => {
      if (!window.park.user.isLoggedIn()) {
        return;
      }

      window.park.api.verifyCurrentUser().then((result) => {
        window.park.user.setUser(result.user);
        window.park.user.login();

        window.park.api.getUserPreferences().then((preferences) => {
          window.park.user.setPreferences(preferences);
        });
      });
    });
  });
})();
