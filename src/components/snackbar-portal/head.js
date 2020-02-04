(() => {
  function openSnackbarPortal() {
    if (!window.park.snackbarManager) {
      window.setTimeout(openSnackbarPortal, 100);
      return;
    }

    window.park.snackbarManager.open('portal');
  }

  window.park.observer.initialize('.park-snackbar-portal', (elem) => {
    const portalLoaded = elem.querySelector('.park-portal--is-loaded');

    if (portalLoaded) {
      openSnackbarPortal();
    } else {
      elem.addEventListener('park.portal:load', () => {
        window.park.console.log('Portal load registered');

        openSnackbarPortal();
      }, true);
    }
  });
})();
