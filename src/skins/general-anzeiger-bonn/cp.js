(() => {
  const channelId = 'YGnoWCR4Xec5vwexm';
  const url = `https://static.cleverpush.com/channel/loader/${channelId}.js?nocache=${(new Date()).getTime()}`;
  let elem = {};

  window.CleverPush = window.CleverPush || [];

  function handleEvent(e) {
    window.park.resourceLoader.script(url, () => {
      if (
        window.Notification &&
        window.Notification.permission &&
        window.Notification.permission === 'granted' &&
        window.park.storage.get('cleverpush-subscription-status') !== 'unsubscribed'
      ) {
        window.CleverPush.push(['triggerBellClick']);
      } else {
        window.CleverPush.push(['triggerOptIn']);
      }
    });

    const headerAdCloseButton = document.querySelector('.park-header__offer [data-close]');

    if (headerAdCloseButton) {
      headerAdCloseButton.click();
    }

    if (e && e.preventDefault) {
      e.preventDefault();
    }
  }

  function close() {
    window.CleverPush.push(['hidePanel']);
  }

  if (
    window.Notification &&
    window.Notification.permission &&
    window.Notification.permission === 'granted'
  ) {
    window.park.resourceLoader.script(url);
  }

  document.addEventListener('park.floatingBell:settings', handleEvent);

  document.addEventListener('park.floatingBell:hide', () => {
    window.park.notifications.create({
      id: 'park-floating-bell-hidden',
      data: {
        headline: 'Benachrichtigungen können Sie im Menü anpassen.',
        type: 'success',
      },
    });
  });

  window.park.observer.initialize('.cleverpush-panel', (panel) => {
    elem = panel;
    window.park.overlayManager.register(panel, () => {
      close();
    });
  });

  function registerEvents() {
    if (
      !window.park ||
      !window.park.eventHub ||
      !window.park.eventHub.register
    ) {
      window.setTimeout(registerEvents, 100);
      return;
    }
// The following would be triggered with an header ad offer link with an anker #pushnotifications
    window.park.eventHub.register('click', 'a[href="#pushnotifications"], a[href="#pushnotifications"] *', handleEvent);

    window.park.eventHub.register('click', '.cleverpush-panel-close', () => {
      window.park.overlayManager.unregister(elem);
    });
  }

  registerEvents();

  window.CleverPush.push(['on', 'panelHidden', () => {
    window.park.overlayManager.unregister(elem);
  }]);

  document.addEventListener('park.navigation:pageview', () => {
    close();
  });

  window.addEventListener('storage', (e) => {
    if (e.key !== 'cleverpush-subscription-status') {
      return;
    }

    if (e.newValue === 'unsubscribed') {
      window.park.storage.set('park.floatingBell.hidden', 'true');
      document.querySelector('.park-floating-bell').style.display = 'none';
    }

    if (e.oldValue === 'unsubscribed' && e.newValue !== 'unsubscribed') {
      window.park.storage.remove('park.floatingBell.hidden');
      document.querySelector('.park-floating-bell').style.display = 'block';
    }
  });

  if (window.park.storage.get('cleverpush-subscription-status') === 'unsubscribed') {
    window.park.storage.set('park.floatingBell.hidden', 'true');
    document.querySelector('.park-floating-bell').style.display = 'none';
  }

  window.CleverPush.push(['on', 'subscribed', () => {
    window.park.notifications.create({
      id: 'cleverpush-subscribed',
      data: {
        headline: 'Push-Benachrichtigungen erfolgreich abonniert',
        type: 'success',
      },
    });
  }]);

  window.CleverPush.push(['on', 'unsubscribed', () => {
    window.park.notifications.create({
      id: 'cleverpush-unsubscribed',
      data: {
        headline: 'Sie erhalten jetzt keine Push-Benachrichtigungen mehr',
        type: 'success',
      },
    });
  }]);

  window.park.safeInputs.whitelistSelector('.cleverpush-panel input');
  window.park.safeInputs.whitelistSelector('.cleverpush-confirm input');
  window.park.safeInputs.whitelistSelector('input[class^="cleverpush"]');
  window.park.safeInputs.whitelistSelector('[class^="cleverpush"] input');

  window.addEventListener('park.pushnotifications', handleEvent);
  window.addEventListener('park.pushnotifications:general', handleEvent);
})();
