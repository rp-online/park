(() => {
  window.park.observer.initialize('.park-back-to-article', (elem) => {
    if (
      document.referrer &&
      document.referrer.startsWith(`${window.location.protocol}//${window.location.hostname}`) &&
      (document.referrer.indexOf('aid') > -1 || document.referrer.indexOf('artikel') > -1)
    ) {
      const url = document.referrer.replace(/\?.*$/, '');

      elem.querySelector('.park-button[href]').href = url;
      elem.removeAttribute('hidden');
    }
  }, false);
})();
