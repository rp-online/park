(() => {
  function hide(elem, type, permanently = false) {
    const settings = window.park.storage.get('park.suppressible') || {};

    if (permanently) {
      settings[type] = {
        hide: true,
      };
    } else {
      settings[type] = {
        hiddenOn: new Date().toString(),
        hide: true,
      };
    }

    window.park.storage.set('park.suppressible', settings);
    window.park.eventHub.trigger(elem, 'park.suppressible:hidden', {
      permanently,
    });
  }

  window.park.eventHub.register('click', '.park-suppressible__close', (e) => {
    const elem = e.target.closest('.park-suppressible');
    const type = elem.getAttribute('data-type');

    hide(elem, type, false);
  });

  window.park.eventHub.register('park.suppressible:hide-permanently', '*', (e) => {
    const elem = e.target.closest('.park-suppressible');

    if (!elem) {
      return;
    }

    const type = elem.getAttribute('data-type');

    hide(elem, type, true);
  });
})();
