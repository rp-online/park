(() => {
  function trackPageview(elem) {
    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.navigation:pageview', {
        elem,
      });
    }
  }

  /* The following allows for cursor navigation in between all currently visible menu items */
  window.park.navigationHelper.enableArrowNav('.park-navigation__panel');

  /* Catch toggle events of submenus and convert them into a tracking event */
  window.park.eventHub.register('park.aria-expanded-toggle:toggle', '.park-navigation__panel [aria-controls][aria-expanded]', (e) => {
    trackPageview(e.target);
  });
})();
