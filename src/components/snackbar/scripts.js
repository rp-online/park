(() => {
  const timers = {};

  window.park.observer.initialize('.park-snackbar--is-selfclosing', (snackbar) => {
    const snackbarId = snackbar.getAttribute('id').replace('park-snackbar-', '');

    window.clearTimeout(timers[snackbarId]);

    timers[snackbarId] = window.setTimeout(() => {
      window.park.snackbarManager.close(snackbarId);
    }, 5000);
  });

  window.park.eventHub.register('click', '.park-snackbar [data-close]', (e) => {
    const snackbar = e.target.closest('.park-snackbar');
    const snackbarId = snackbar.getAttribute('id').replace('park-snackbar-', '');

    window.clearTimeout(timers[snackbarId]);

    window.park.snackbarManager.close(snackbarId);

    e.preventDefault();
    e.stopImmediatePropagation();
  });
})();
