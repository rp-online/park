(() => {
  window.park.observer.initialize('.park-outofpage-portal .park-portal', (elem) => {
    function init() {
      const containerId = elem.getAttribute('data-portal-id');

      if (!containerId) {
        window.setTimeout(init, 100);
        return;
      }

      window.park.eventHub.trigger(document, 'park.portal:removefromreloadalllist', {
        adSlotName: containerId,
      });
    }

    init();
  }, false);
})();
