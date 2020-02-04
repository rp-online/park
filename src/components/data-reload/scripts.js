(() => {
  window.park.eventHub.register('click', '[data-reload]', (e) => {
    window.location.reload();

    e.preventDefault();
  });
})();
