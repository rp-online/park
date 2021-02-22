(() => {
  if (window.location.pathname.lastIndexOf('/sso/') > -1) {
    return;
  }

  const callbacks = [];
  let hasRun = false;
  let isActivatedValue = false;
  const suspendLevel = window.park.exports.config.adblocker ? window.park.exports.config.adblocker.suspendLevel || '0000' : '0000';

  if (suspendLevel === '0000') {
    return;
  }

  const lenghtOfLevel = suspendLevel.length;

  function checkLevelByStep(step) {
    let executeStep = false;
    for (let i = 0; i < lenghtOfLevel; i += 1) {
      if (suspendLevel.charAt(step - 1) === '1') {
        executeStep = true;
      }
    }
    return executeStep;
  }

  function deactivateChecksUntil(datetime) {
    if (window.park.storage.disabled) {
      return;
    }

    if (typeof datetime !== 'string') {
      if (!datetime.toISOString) {
        return;
      }

      datetime = datetime.toISOString();
    }

    window.park.storage.set('park.blocker.deactivateChecksUntil', datetime);
  }

  function getParam(name) {
    // See http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
    return decodeURIComponent((new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`).exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  }

  function runCallbacks() {
    callbacks.forEach((callback) => {
      callback(isActivatedValue);
    });
  }

  function isBlocked(step) {
    if (checkLevelByStep(step)) {
      isActivatedValue = true;
      document.documentElement.classList.add('runs-blocker');
      runCallbacks();
    }
  }

  // 4 step: insert suspiciously named dummy container, Adblock Plus will make it invisible
  function checkAdblockPlusDummy() {
    const body = document.querySelector('body');
    if (!body) {
      window.setTimeout(checkAdblockPlusDummy, 100);
      return;
    }

    const dummy = document.createElement('div');
    dummy.className = 'banner_ad';
    body.appendChild(dummy);

    window.setTimeout(() => {
      hasRun = true;

      if (!dummy || window.getComputedStyle(dummy, null).getPropertyValue('display') === 'none') {
        window.console.info('Adblocker utility: detected an adblocker');
        isActivatedValue = true;
        document.documentElement.classList.add('runs-blocker');
        isBlocked(4);
        return;
      }

      runCallbacks();
    }, 500);
  }

  // 3 step: fetch google tag manager, brave browser will block it
  function fetchGoogleTagManagerTest() {
    if (!window.fetch) {
      checkAdblockPlusDummy();
      return;
    }

    const testURL = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
    const setup = {
      method: 'HEAD',
      mode: 'no-cors',
    };
    const testRequest = new Request(testURL, setup);

    window.fetch(testRequest).then(response => response).then(() => {
      hasRun = true;
      checkAdblockPlusDummy();
    }).catch((e) => {
      hasRun = true;
      isBlocked(3);
      console.log(e);
    });
  }

  // 2 step: check for loaded adblock variable
  function checkAdblockDummy() {
    if (window.park.adBlockDummy && window.park.adBlockDummy.active) {
      // dummy loaded check for google tag manager
      fetchGoogleTagManagerTest();
      return;
    }
    // dummy blocked
    hasRun = true;
    isBlocked(2);
  }

  // 1 step: load adsbygoogle dummy and check if variable is set
  function loadDummy() {
    const body = document.querySelector('body');
    if (!body) {
      window.setTimeout(loadDummy, 100);
      return;
    }
    const dummyScript = document.createElement('script');
    dummyScript.src = `/assets/adsbygoogle.js?v=${window.park.exports.config.version}`;
    dummyScript.onload = () => {
      // check for variable to bypass adblock intercept
      checkAdblockDummy();
    };

    dummyScript.onerror = () => {
      console.log('1. dummyScript.onerror');
      hasRun = true;
      isBlocked(1);
    };
    body.appendChild(dummyScript);
  }

  function run() {
    // If user is logged in and ads are disabled, bail out
    if (
      document.documentElement.classList.contains('is-ad-free')
    ) {
      window.console.info('Adblocker utility: ad free page detected. Aborting');
      hasRun = true;
      runCallbacks();
      return;
    }


    // Look for a deactivation date and if you find and we are within that time, bail out.
    const datetime = window.park.storage.get('park.blocker.deactivateChecksUntil');

    if (datetime && (new Date(datetime)) > Date.now()) {
      window.console.info('Adblocker utility: temporarily deactivated checks detected. Aborting');
      hasRun = true;
      runCallbacks();
      return;
    }

    const body = document.querySelector('body');

    if (!body) {
      window.setTimeout(run, 100);
      return;
    }

    // start testing for adblocker
    loadDummy();
  }

  function isActivated(callback) {
    if (!hasRun) {
      callbacks.push(callback);
    } else {
      callback(isActivatedValue);
    }
  }

  function handleAdblockerUser() {
    // If no adblocker landingpage is defined, then do nothing and leave early
    if (
      !window.park.exports ||
      !window.park.exports.config ||
      !window.park.exports.config.adblocker ||
      !window.park.exports.config.adblocker.landingpage
    ) {
      window.console.error('Adblocker handler: Ablocker landingpage has not been configured');
      return;
    }

    // If a referrer has been previously stored and if we are on the adblocker landing
    // page, then replace the top URL with the referrer's URL

    const referrer = window.park.storage.get('park.blocker.referrer');

    // If no referrer exists, set referrer fallback to prevent endless page refresh loop
    if (!referrer) {
      window.park.storage.set('park.blocker.referrer', `${window.location.protocol}//${window.location.hostname}`);
    }

    if (
      window.history &&
      referrer &&
      window.location.href.indexOf(window.park.exports.config.adblocker.landingpage) > -1
    ) {
      window.console.info('Adblocker handler: detected landingpage');
      window.history.replaceState('adblocker-landingpage', document.title, referrer);
      return;
    }

    // If current page differs from from adblocker landingpage, then store
    // current url...
    if (
      window.history &&
      window.history.state !== 'adblocker-landingpage' &&
      window.location.href.indexOf(window.park.exports.config.adblocker.landingpage) === -1
    ) {
      window.console.info('Adblocker handler: setting referrer');
      window.park.storage.set('park.blocker.referrer', window.location.href);
    }

    // ...and redirect to adblocker landingpage
    window.console.info('Adblocker handler: redirecting to the landingpage');
    window.location.href = window.park.exports.config.adblocker.landingpage;
  }

  // If adblocker checking is not defined or is set to false, leave the function
  // except adblock screen itself
  if ((!window.park.exports ||
    !window.park.exports.config ||
    !window.park.exports.config.adblocker ||
    !window.park.exports.config.adblocker.check) && (typeof window.park.exports.config.adblocker !== 'undefined' &&
    typeof window.park.exports.config.adblocker.landingpage !== 'undefined') &&
    (window.location.pathname !== window.park.exports.config.adblocker.landingpage)) {
    window.park.console.info('Adblocker utility: Adblocker checks disabled by configuration');
    return;
  }

  // Check for Welect passback parameter at this place here and if present set date in ISO
  // via deactivateChecksUntil() function, eg.
  // deactivateChecksUntil('2018-07-28T13:27:44.699Z')
  if (getParam('token')) {
    if (!window.park.exports.config.adblocker.welectIntegratorBaseUrl) {
      run();
      return;
    }

    const token = getParam('token');

    window.park.ajax(`${window.park.exports.config.adblocker.welectIntegratorBaseUrl}/api/v1/session/${token}`)
      .then(result => result.json())
      .then((result) => {
        if (result.valid === true || token === 'heftig') {
          const dateUntil = new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString();
          deactivateChecksUntil(dateUntil);
          window.console.info('Adblocker utility: recieved valid token');
        } else {
          window.console.info('Adblock utility: token unvalid');
          deactivateChecksUntil('');
          run();
        }
      });
  } else {
    // Run adblocker detection
    run();
  }


  // Hook yourself to the isActivated function and wait for its verdict
  isActivated((result) => {
    // If no adblocker is active, then do nothing
    if (!result) {
      window.console.info('Adblocker handler: no adblocker detected');
      if (!!window.park.storage.get('park.blocker.referrer') && (window.location.pathname.indexOf('/info/adblocker/') !== -1 || window.location.pathname.indexOf('adblocker-screen.html') !== -1)) {
        window.location.href = window.park.storage.get('park.blocker.referrer');
      }
      return;
    }

    // If an adblocker is being used, give the user a bit of treat
    window.console.info('Adblocker handler: adblocker detected');
    handleAdblockerUser();
  });

  window.park = Object.assign({}, window.park, {
    blocker: {
      isActivated,
      deactivateChecksUntil,
      getReferrer: () => {
        window.park.storage.get('park.blocker.referrer');
      },
    },
  });
})();
