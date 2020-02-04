(() => {
  window.park.observer.initialize('.park-adblocker-screen', (elem) => {
    // Check Welect preflight, and if that responds positively then set a CSS class
    window.park.welect.preflightCheck((result) => {
      if (!result) {
        return;
      }

      elem.classList.add('park-adblocker-screen--show-welect');

      const referrer = window.park.storage.get('park.blocker.referrer');
      const href = `${window.park.exports.config.adblocker.welectIntegratorBaseUrl}/${window.park.exports.config.adblocker.welectIntegrationId}/pre_offer?origin=${encodeURIComponent(referrer)}`;
      elem.querySelector('.park-adblocker-screen__option--welect .park-button').setAttribute('href', href);
    });
  });
})();
