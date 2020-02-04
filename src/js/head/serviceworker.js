/* eslint-disable */
(() => {
  // Disabling the service worker registration for now
  // to not collide with CleverPush's registration of a SW
  return;

  if (!window.navigator.serviceWorker) {
    return;
  }

  const sw = window.navigator.serviceWorker;

  sw.register(`${window.park.exports.config.rootBase.replace(/\/$/, '')}/serviceworker.js?version=${window.park.exports.config.version}`, {
    scope: `${window.park.exports.config.rootBase.replace(/\/$/, '')}/`,
  }).then((registration) => {
    // registration worked
    console.log(`Registration succeeded. Scope is ${registration.scope}`);

    if (window.location.href.indexOf('park_layout=1') > -1) {
      sw.controller.postMessage({
        park_layout: 1,
      });
    }

    if (window.location.href.indexOf('park_layout=0') > -1) {
      sw.controller.postMessage({
        park_layout: 0,
      });
    }
  }).catch((error) => {
    // registration failed
    console.log(`Registration failed with ${error}`);
  });
})();
