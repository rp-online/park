(() => {
  function toggleMenu() {
    if (!window.park.user.isLoggedIn()) {
      window.park.notifications.create({
        id: 'authentication-required',
        data: {
          headline: 'Für diese Funktion müssen Sie angemeldet sein',
          type: 'error',
        },
      });
      return;
    }

    const toggleButtons = window.park.$('[aria-controls="park-notification-panel"]');
    const navigation = document.getElementById('park-notification-panel');

    if (!navigation) {
      window.setTimeout(toggleMenu, 100);
      return;
    }

    const panel = navigation.querySelector('.park-notification-panel__panel');

    window.park.eventHub.trigger(document, 'park.menu-manager:open', {
      elem: navigation,
    });

    if (navigation.getAttribute('aria-hidden') === 'true') {
      toggleButtons.forEach(button => button.setAttribute('aria-expanded', 'true'));
      panel.scrollTop = 0;

      window.park.overlayManager.register(navigation, toggleMenu);

      window.setTimeout(() => {
        navigation.removeAttribute('aria-hidden');
      }, 100);

      if (window.park.eventHub) {
        window.park.eventHub.trigger(document, 'park.notification-panel:seen');
      }
    } else {
      toggleButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
      navigation.setAttribute('aria-hidden', 'true');

      window.park.overlayManager.unregister(navigation);
    }
  }

  if ('ontouchstart' in window) {
    window.park.eventHub.register('touchstart', '[href="#park-notification-panel"]', (e) => {
      toggleMenu();
      e.stopImmediatePropagation();
    });

    window.park.eventHub.register('touchend', '[href="#park-notification-panel"]', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    });
  } else {
    window.park.eventHub.register('click', '[href="#park-notification-panel"]', (e) => {
      toggleMenu();

      e.preventDefault();
      e.stopImmediatePropagation();
    });
  }
})();
