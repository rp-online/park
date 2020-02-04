(() => {
  function trackPageview(elem) {
    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.navigation:pageview', {
        elem,
      });
    }
  }

  function toggleMenu() {
    const toggleButtons = window.park.$('[aria-controls="park-navigation"]');
    const navigation = document.getElementById('park-navigation');

    if (!navigation) {
      window.setTimeout(toggleMenu, 100);
      return;
    }

    const panel = navigation.querySelector('.park-navigation__panel');

    window.park.eventHub.trigger(document, 'park.menu-manager:open', {
      elem: navigation,
    });

    if (navigation.getAttribute('aria-hidden') === 'true') {
      toggleButtons.forEach(button => button.setAttribute('aria-expanded', 'true'));
      if (panel) {
        panel.scrollTop = 0;
      }

      window.park.overlayManager.register(navigation, toggleMenu);

      window.setTimeout(() => {
        navigation.removeAttribute('aria-hidden');
      }, 100);
    } else {
      toggleButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
      navigation.setAttribute('aria-hidden', 'true');

      window.park.overlayManager.unregister(navigation);
    }

    trackPageview(navigation);
  }

  if ('ontouchstart' in window) {
    window.park.eventHub.register('touchstart', '.park-header__offer [data-close]', (e) => {
      window.park.storage.set('park.offer.suppress', '10');
      document.documentElement.classList.remove('with-offers');

      e.preventDefault();
      e.stopImmediatePropagation();
    });

    window.park.eventHub.register('touchstart', '.park-header__menu-toggle-link', (e) => {
      toggleMenu();
      e.stopImmediatePropagation();
    });

    window.park.eventHub.register('touchend', '.park-header__menu-toggle-link', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    });
  } else {
    window.park.eventHub.register('click', '.park-header__menu-toggle-link', (e) => {
      toggleMenu();

      e.preventDefault();
      e.stopImmediatePropagation();
    });

    window.park.eventHub.register('click', '.park-header__offer [data-close]', (e) => {
      window.park.storage.set('park.offer.suppress', '10');
      document.documentElement.classList.remove('with-offers');

      e.preventDefault();
      e.stopImmediatePropagation();
    });
  }

  window.park.eventHub.register('keydown', '.park-header__search .park-input__input', (e) => {
    const input = e.target;

    if (e.key !== 'Escape' && e.key !== 'Esc') {
      return;
    }

    if (!input.parkValue && !input.value) {
      document.querySelector(`[for="${input.getAttribute('id')}"]`).focus();
    }
  });

  window.park.observer.initialize('.park-header__sales-cta', (elem) => {
    window.park.eventHub.trigger(document, 'park.header-sales-cta:impression', {
      elem: elem.querySelector('.park-header__sales-cta-link'),
    });
  });

  window.park.eventHub.register('click', '.park-header__sales-cta-link', (e) => {
    window.park.eventHub.trigger(document, 'park.header-sales-cta:click', {
      elem: e.target,
    });
  });
})();
