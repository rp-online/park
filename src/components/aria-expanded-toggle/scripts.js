(() => {
  /*
  We delay the following by 100 ms to enable more specific script to pull ahead
  and to stop this script applying itself to a toggle via e.stopImmediatePropagation()
  e.g. the header script for toggling the menu
   */
  function handleEvent(e) {
    const button = e.target.closest('[aria-controls][aria-expanded]');
    const targetIds = button.getAttribute('aria-controls').split(' ');

    if (button.getAttribute('aria-expanded') === 'false') {
      button.setAttribute('aria-expanded', 'true');
    } else {
      button.setAttribute('aria-expanded', 'false');
    }

    targetIds.forEach((targetId) => {
      const target = document.getElementById(targetId);

      if (!target) {
        e.preventDefault();
        return;
      }

      if (target.getAttribute('aria-hidden') === 'false' || target.getAttribute('aria-hidden') === null) {
        target.setAttribute('aria-hidden', 'true');
      } else {
        target.setAttribute('aria-hidden', 'false');
      }
    });

    if (window.park.eventHub) {
      window.park.eventHub.trigger(button, 'park.aria-expanded-toggle:toggle');
    }
  }

  window.setTimeout(() => {
    if ('ontouchstart' in window) {
      window.park.eventHub.register('touchstart', '[class^="park"][aria-controls][aria-expanded]', (e) => {
        handleEvent(e);
      });
      window.park.eventHub.register('touchend', '[class^="park"][aria-controls][aria-expanded]', (e) => {
        e.preventDefault();
      });
    } else {
      window.park.eventHub.register('click', '[class^="park"][aria-controls][aria-expanded]', (e) => {
        handleEvent(e);
        e.preventDefault();
      });
    }
  }, 100);
})();
