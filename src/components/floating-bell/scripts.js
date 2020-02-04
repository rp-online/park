(() => {
  const hideDuration = 28 * 24 * 60 * 60 * 1000; // 28 days

  function storeHiddenSettings() {
    const hiddenOn = new Date().toString();
    window.park.storage.set('park.floatingBell.hidden', { hiddenOn });
  }

  function showOrHide(elem) {
    let hideFloatingBell = window.park.storage.get('park.floatingBell.hidden');

    window.setTimeout(() => {
      elem.classList.add('park-floating-bell--animations-enabled');
    }, 1000);

    if (!hideFloatingBell) {
      elem.style.display = 'block';
      return;
    }

    /** update old boolean value to work with new time system **/
    if (hideFloatingBell && typeof hideFloatingBell === 'boolean') {
      storeHiddenSettings();
      // load updated value
      hideFloatingBell = window.park.storage.get('park.floatingBell.hidden');
    }

    const now = Date.now();
    const then = new Date(hideFloatingBell.hiddenOn).getTime();
    const hide = (now - then) < hideDuration;

    elem.style.display = hide ? 'none' : 'block';
    if (!hide) {
      window.park.storage.remove('park.floatingBell.hidden');
    }
  }

  function triggerSettings(elem) {
    window.park.console.log('park.floatingBell:settings');
    window.park.eventHub.trigger(document, 'park.floatingBell:settings', {
      elem,
    });
  }


  window.park.eventHub.register('click', '.park-floating-bell, .park-floating-bell > svg, .park-floating-bell > svg > *, .park-floating-bell__button--settings', (e) => {
    const elem = e.target.closest('.park-floating-bell');

    triggerSettings(elem);
  });

  window.park.eventHub.register('click', '.park-floating-bell__button--hide', (e) => {
    const elem = e.target.closest('.park-floating-bell');

    storeHiddenSettings();

    window.park.console.log('park.floatingBell:hide');
    window.park.eventHub.trigger(document, 'park.floatingBell:hide', {
      elem,
    });

    showOrHide(elem);
    e.stopImmediatePropagation();
  });

  window.park.pushNotifications.isSupported().then(() => {
    if (
      window.Notification &&
      window.Notification.permission &&
      window.Notification.permission === 'denied'
    ) {
      return;
    }

    window.park.observer.initialize('.park-floating-bell', showOrHide, false);
  });
})();
