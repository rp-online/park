(() => {
  function trackPageview(elem) {
    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.navigation:pageview', {
        elem,
      });
    }
  }

  /* Catch toggle events of submenus and convert them into a tracking event */
  window.park.eventHub.register('park.aria-expanded-toggle:toggle', '.park-section-nav [aria-controls][aria-expanded]', (e) => {
    trackPageview(e.target.closest('.park-section-nav'));
  });

  if (!window.matchMedia) {
    return;
  }

  function handleMediaQueryChange(e) {
    if (e.matches) {
      /* Desktop */
      return;
    }

    /* Mobile */
    const toggleButtons = window.park.$('.park-section-nav [aria-controls][aria-expanded]');

    toggleButtons.forEach((button) => {
      const targetId = button.getAttribute('aria-controls');
      const target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      if (button.getAttribute('aria-expanded') === 'true') {
        button.setAttribute('aria-expanded', 'false');
      }

      if (target.getAttribute('aria-hidden') === 'false' || target.getAttribute('aria-hidden') === null) {
        target.setAttribute('aria-hidden', 'true');
      }
    });
  }

  const mediaQueryList = matchMedia(window.park.exports.mediaqueries.desktop);

  mediaQueryList.addListener(handleMediaQueryChange);
})();
