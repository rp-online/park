/* eslint-disable */
(() => {
  function detectPrivateMode() {
    return new Promise((resolve) => {
      const on = () => resolve(true); // is in private mode
      const off = () => resolve(false); // not private mode
      const testLocalStorage = () => {
        try {
          if (localStorage.length) off();
          else {
            localStorage.x = 1;
            localStorage.removeItem('x');
            off();
          }
        } catch (e) {
          // Safari only enables cookie in private mode
          // if cookie is disabled then all client side storage is disabled
          // if all client side storage is disabled, then there is no point
          // in using private mode
          navigator.cookieEnabled ? on() : off();
        }
      };
      // Chrome & Opera
      if (window.webkitRequestFileSystem) {
        return void window.webkitRequestFileSystem(0, 0, off, on);
      }
      // Firefox
      if ('MozAppearance' in document.documentElement.style) {
        const db = indexedDB.open('test');
        db.onerror = on;
        db.onsuccess = off;
        return void 0;
      }
      // Safari
      if (/constructor/i.test(window.HTMLElement) || (navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
          navigator.userAgent &&
          navigator.userAgent.indexOf('CriOS') < 0 &&
          navigator.userAgent.indexOf('FxiOS') < 0)) {
        if (typeof window.openDatabase !== 'undefined') {
          try {
            window.openDatabase(null, null, null, null);
            window.localStorage.setItem('test', 1);
          } catch (e) {
            return on();
          }
        }
        return testLocalStorage();
      }
      // IE10+ & Edge
      if (!window.indexedDB && (window.PointerEvent || window.MSPointerEvent)) {
        return on();
      }
      // others
      return off();
    });
  }

  function supportsPush() {
    let supported = true;
    let browserType = null;

    return new Promise((resolve, reject) => {
      detectPrivateMode()
          .then((isPrivate) => {
            if (isPrivate) {
              supported = false;
              browserType = null;
              reject(new Error('Private browsing mode not supported.'));
            } else {
              // safari
              if ('safari' in window && 'pushNotification' in window.safari) {
                browserType = 'safari';

                // w3c web push
              } else if (typeof window.Notification !== 'undefined' && ('serviceWorker' in navigator || location.protocol === 'http:')) {
                // navigator.serviceWorker is undefined for chrome on http sites
                browserType = 'w3c';

              } else {
                supported = false;
                browserType = null;
                reject(new Error('Browser is not supported.'));
              }

              if (supported && browserType !== 'safari' && browserType !== 'ios') {
                if (location.protocol !== 'http:' && !('showNotification' in ServiceWorkerRegistration.prototype)) {
                  supported = false;
                  reject(new Error('Notifications aren\'t supported.'));

                } else if (!('PushManager' in window)) {
                  supported = false;
                  reject(new Error('Push messaging isn\'t supported.'));
                }

                if (!('serviceWorker' in navigator) && location.protocol !== 'http:') {
                  supported = false;
                  reject(new Error('Service workers are not supported.'));
                }
              }

              if (supported) {
                resolve(browserType);
              }
            }
          });
    });
  }

  window.park = Object.assign({}, window.park, {
    pushNotifications: {
      isSupported: supportsPush,
    },
  });
})();
