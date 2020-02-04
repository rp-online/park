(() => {
  const storageKey = 'park.thirdPartyManager.preferences';

  function createNotification(config) {
    if (!window.park.notifications) {
      window.setTimeout(() => {
        createNotification(config);
      }, 200);
      return;
    }

    window.park.notifications.create(config);
  }

  function normalizeName(name) {
    return name.toLowerCase().replace(/\s+/, '_');
  }

  function activate(name) {
    const preferences = window.park.storage.get(storageKey) || {};

    preferences[normalizeName(name)] = true;

    window.park.storage.set(storageKey, preferences);

    createNotification({
      id: 'third-party-manager',
      data: {
        headline: `Inhalte von ${name} wurden aktiviert.`,
        body: `<a href="javascript:window.park.thirdPartyManager.deactivate('${name}')">Rückgängig machen</a>`,
        type: 'success',
      },
    });
  }

  function deactivate(name) {
    const preferences = window.park.storage.get(storageKey) || {};

    delete preferences[normalizeName(name)];

    window.park.storage.set(storageKey, preferences);

    createNotification({
      id: 'third-party-manager',
      data: {
        headline: `Inhalte von ${name} wurden deaktiviert.`,
        body: `<a href="javascript:window.park.thirdPartyManager.activate('${name}')">Rückgängig machen</a>`,
        type: 'success',
      },
    });
  }

  function isActive(name) {
    const preferences = window.park.storage.get(storageKey) || {};

    return !!preferences[normalizeName(name)];
  }

  window.park = Object.assign({}, window.park, {
    thirdPartyManager: {
      activate,
      deactivate,
      isActive,
    },
  });
})();
