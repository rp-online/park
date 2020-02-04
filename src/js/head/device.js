(() => {
  let resizeTimer;

  function setRootClass() {
    if (window.park.device.isMobile()) {
      document.documentElement.classList.add('is-mobile');
      document.documentElement.classList.remove('is-desktop');
    } else {
      document.documentElement.classList.add('is-desktop');
      document.documentElement.classList.remove('is-mobile');
    }
  }

  function handleResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(setRootClass, 100);
  }

  window.park = Object.assign({}, window.park, {
    device: {
      isMobile: () => window.park.exports &&
        window.matchMedia &&
        !matchMedia(window.park.exports.mediaqueries.desktop).matches,
      isOffline: () => {
        if (navigator.onLine === false) {
          return true;
        }
        return false;
      },
      hasFastConnection: () => {
        if (navigator.onLine === false) {
          return false;
        }

        if (navigator.connection && navigator.connection.effectiveType) {
          switch (navigator.connection.effectiveType) {
            default:
              return true;

            case 'slow-2g':
            case '2g':
              return false;
          }
        }

        return true;
      },
    },
  });

  window.addEventListener('resize', handleResize);

  setRootClass();
})();
