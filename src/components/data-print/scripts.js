(() => {
  window.park.eventHub.register('click', '[data-print]', (e) => {
    const elem = e.target.closest('[data-print]');
    const target = elem.getAttribute('data-print');

    window[target || 'self'].print();
  });
})();
