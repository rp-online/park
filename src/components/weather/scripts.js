(() => {
  window.park.eventHub.register('park.widget:initialized', '.park-weather > .park-widget', (e) => {
    e.target.closest('.park-weather').classList.add('park-weather--is-interactive');
  });
})();
