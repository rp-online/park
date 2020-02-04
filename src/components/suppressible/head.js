(() => {
  const hideDuration = 30 * 24 * 60 * 60 * 1000; // 30 days

  function update(elem) {
    const type = elem.getAttribute('data-type');
    const settings = window.park.storage.get('park.suppressible') || {};

    elem.setAttribute('aria-hidden', settings && settings[type] ? 'true' : 'false');
    elem.querySelector('.park-suppressible__close').setAttribute('aria-expanded', settings && settings[type] ? 'false' : 'true');

    if (
      settings &&
      settings[type] &&
      settings[type].hiddenOn
    ) {
      const now = Date.now();
      const then = new Date(settings[type].hiddenOn).getTime();
      if (now - then < hideDuration) {
        return;
      }

      elem.setAttribute('aria-hidden', 'false');
      elem.querySelector('.park-suppressible__close').setAttribute('aria-expanded', 'true');

      delete settings[type];

      window.park.storage.set('park.suppressible', settings);
    }
  }

  window.park.observer.initialize('.park-suppressible', (elem) => {
    document.addEventListener('park.user:authchange', () => {
      update(elem);
    });

    update(elem);
  }, false);
})();
