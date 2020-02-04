(() => {
  const prefix = 'park-third-party-configurator';

  function update(elem) {
    const name = elem.getAttribute('name');

    elem.checked = window.park.thirdPartyManager.isActive(name);
  }

  window.park.observer.initialize(`.${prefix} .park-input__input`, (elem) => {
    document.addEventListener('park.user:authchange', () => {
      update(elem);
    });

    update(elem);
  }, false);
})();
