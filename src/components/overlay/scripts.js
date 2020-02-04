(() => {
  let timer;

  window.park.eventHub.register('ontouchstart' in window ? 'touchstart' : 'click', '.park-overlay__close', (e) => {
    const overlay = e.target.closest('.park-overlay');
    const overlayId = overlay.getAttribute('id').replace('park-overlay-', '');
    window.park.overlayManager.close(overlayId);
    e.stopImmediatePropagation();
    return false;
  });

  window.park.eventHub.register([
    'webkitAnimationStart',
    'oAnimationStart',
    'msAnimationStart',
    'MSAnimationStart',
    'animationstart',
  ].join(' '), '.park-overlay', (e) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      const elem = e.target;

      if (elem.getAttribute('aria-hidden') === 'true') {
        return;
      }

      const overlayId = elem.getAttribute('id').replace('park-overlay-', '');

      window.park.overlayManager.open(overlayId);
    });
  });
})();
