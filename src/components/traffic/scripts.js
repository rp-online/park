(() => {
  window.park.eventHub.register('park.widget:initialized', '.park-traffic > .park-widget', (e) => {
    e.target.closest('.park-traffic').classList.add('park-traffic--is-interactive');
  });
})();
