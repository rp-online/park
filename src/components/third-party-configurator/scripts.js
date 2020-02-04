(() => {
  const prefix = 'park-third-party-configurator';

  window.park.eventHub.register('change', `.${prefix} input[type="checkbox"]`, (e) => {
    const elem = e.target;
    const name = elem.getAttribute('name');

    if (elem.checked) {
      window.park.thirdPartyManager.activate(name);
    } else {
      window.park.thirdPartyManager.deactivate(name);
    }
  });

  window.park.observer.initialize(`.${prefix}--widget`, (elem) => {
    window.park.api.getThirdPartyPrivacyConfig()
      .then((result) => {
        if (!result.thirdParties) {
          return;
        }

        const initialState = {
          type: 'third-party-configurator',
          initialState: {
            items: result.thirdParties,
          },
        };

        const widget = window.park.widgets.create(initialState);
        elem.parentNode.replaceChild(widget, elem);
      });
  });
})();
