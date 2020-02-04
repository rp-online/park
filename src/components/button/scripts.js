(() => {
  window.park.eventHub.register('click', '.park-button', (e) => {
    const elem = e.target.closest('.park-button');

    window.park.eventHub.trigger(document, 'park.button:click', {
      elem,
    });
  });
})();
