(() => {
  const prefix = 'park-third-party-activator';

  window.park.eventHub.register('change', `.${prefix}__optin input[type="checkbox"]`, (e) => {
    const input = e.target;
    const elem = input.closest(`.${prefix}`);
    const name = elem.getAttribute('data-name');

    if (input.checked) {
      window.park.thirdPartyManager.activate(name);
    } else {
      window.park.thirdPartyManager.deactivate(name);
    }
  });
})();
