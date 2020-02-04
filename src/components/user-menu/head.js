(() => {
  window.park.observer.initialize('.park-user-menu', (elem) => {
    if (!window.park.user.isLoggedIn()) {
      elem.classList.add('park-user-menu--is-done');
    }
  }, false);
})();
