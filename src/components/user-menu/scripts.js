(() => {
  function update(elem) {
    window.park.user.getUsername().then((result) => {
      const mainButton = elem.querySelector('.park-user-menu__link');
      const mainButtonText = mainButton.querySelector('.park-user-menu__link-text');

      if (!mainButtonText) {
        return;
      }

      if (result) {
        mainButtonText.textContent = result;
        mainButton.setAttribute('href', '/sso/login');
      } else {
        mainButtonText.textContent = mainButton.getAttribute('data-initial-label') || '';
      }
      elem.classList.add('park-user-menu--is-done');
    });

    window.park.user.getSSOCookieSnippet().then((result) => {
      if (result) {
        elem.querySelector('.park-user-menu__property_bag').innerHTML = result;
      }
    });

    const config = window.park.exports.config;
    if (
        !config.appMode ||
        (
            config.notifications &&
            config.notifications.distribution &&
            config.notifications.distribution.onsite
        )
    ) {
      const subscriptionsUnread = parseInt(window.park.storage.get('park.user.subscriptionsUnreadCount') || 0, 10);
      elem.setAttribute('data-notification-count', (subscriptionsUnread < 100 ? subscriptionsUnread : '99'));

      const menuItem = elem.querySelector('[href="#park-notification-panel"]');
      if (menuItem) {
        menuItem.setAttribute('data-notification-count', (subscriptionsUnread < 100 ? subscriptionsUnread : '99'));
      }
    }
  }

  function toggleMenu(closeOnly) {
    const toggleButtons = window.park.$('[aria-controls="park-user-menu__list"]');
    const navigation = document.getElementById('park-user-menu__list');

    window.park.eventHub.trigger(document, 'park.menu-manager:open', {
      elem: navigation,
    });

    if (!closeOnly && navigation.getAttribute('aria-hidden') === 'true') {
      toggleButtons.forEach(button => button.setAttribute('aria-expanded', 'true'));

      window.park.overlayManager.register(navigation, toggleMenu);

      window.setTimeout(() => {
        navigation.removeAttribute('aria-hidden');
      }, 100);
    } else {
      toggleButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
      navigation.setAttribute('aria-hidden', 'true');

      window.park.overlayManager.unregister(navigation);
    }
  }

  window.park.eventHub.register('ontouchstart' in window ? 'touchstart' : 'click', '.park-user-menu__toggle', (e) => {
    toggleMenu();

    e.preventDefault();
    e.stopImmediatePropagation();
  });

  window.park.eventHub.register('click', '.park-user-menu__link, .park-user-menu__item-link', (e) => {
    toggleMenu(true);

    e.stopImmediatePropagation();
  });

  window.park.observer.initialize('.park-user-menu', (elem) => {
    document.addEventListener('park.user:authchange', () => {
      update(elem);
    });

    update(elem);
  }, false);
})();
