(() => {
  const cookieConsent = window.park.storage.disabled ? window.park.cookie.get('rpo-cookie-hint-disabled', 'true') : window.park.storage.get('park.cookieConsent');
  const isClickDummy = (
    window.park.exports &&
    window.park.exports.config &&
    window.park.exports.config.isClickDummy
  );

  if (cookieConsent !== 'true' && cookieConsent !== true) {
    window.setTimeout(() => {
      window.park.snackbarManager.open('cookies');
    }, 1000);
  } else if (isClickDummy) {
    window.setTimeout(() => {
      window.park.storage.remove('park.cookieConsent');
    }, 1000);
  }

  window.addEventListener('park.snackbar:close', (e) => {
    if (e.detail.elem.id === 'park-snackbar-cookies') {
      window.park.storage.set('park.cookieConsent', 'true');
      window.park.cookie.set('rpo-cookie-hint-disabled', 'true');
    }
  });
})();
