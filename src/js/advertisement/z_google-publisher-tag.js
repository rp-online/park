(() => {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];

  const gptSkyscraperWidth = [
    0, 300, 320, 375, 468, 728, 768, 800, 970, 1010, 1130, 1170, 1210, 1310, 1610];
  const gptSkyscraperHeight = [
    0, 200, 300, 468, 600, 1050];

  let adreloadOrderidWhitelist = [];
  if (window.ads && window.ads.adreloadOrderidWhitelist) {
    adreloadOrderidWhitelist = (window.ads.adreloadOrderidWhitelist || '').split(/,\s*/);
  }

  const slotMap = new Map();
  const personalizedByPaidStatus = new Promise((resolve) => {
    const npa1 = () => resolve(true); // not personalized
    const npa0 = () => resolve(false); // personalized
    let npa = 0;
    let actionGroupTimer = 0;
    if (window.park.user.isLoggedIn()) {
      const actionGroups = () => {
        if ((!window.dataLayer[0] ||
          !window.dataLayer[0].actionGroups) && actionGroupTimer < 100) {
          const millisecondsOfWaiting = actionGroupTimer * 50;
          window.park.console.info(`NPA waiting (${millisecondsOfWaiting}ms)`);
          actionGroupTimer += 1;
          window.setTimeout(actionGroups, 50);
        } else if (typeof window.dataLayer[0].actionGroups !== 'undefined' &&
          typeof window.dataLayer[0].actionGroups.abonnement !== 'undefined') {
          npa = 1;
          // window.park.console.info(`NPA ${npa}`);
          window.park.storage.set('park.user.npa', npa);
          npa1();
        } else {
          // window.park.console.info(`NPA ${npa}`);
          window.park.storage.set('park.user.npa', npa);
          npa0();
        }
      };
      actionGroups();
    } else {
      // window.park.console.info(`NPA ${npa}`);
      window.park.storage.set('park.user.npa', npa);
      npa0();
    }
  });

  // const gptObservedSlots = new Set();

  const bot = (() => {
    const bots = [
      'Bingbot',
      'Slurp',
      'DuckDuckBot',
      'Baiduspider',
      'YandexBot',
      'Sogou',
      'Exabot',
      'facebookexternalhit',
      'ia_archiver',
    ];

    if (
      !window.navigator ||
      !window.navigator.userAgent
    ) {
      return 'nobot';
    }

    const userAgentNormalized = window.navigator.userAgent.toLowerCase();

    if (userAgentNormalized.indexOf('googlebot') !== -1) {
      return 'gobot';
    }

    if (
      userAgentNormalized.indexOf('bot') !== -1 ||
      userAgentNormalized.indexOf('spider') !== -1
    ) {
      return 'bot';
    }

    const foundIndex = bots.findIndex(bot => userAgentNormalized.indexOf(bot.toLowerCase()) !== -1);
    if (foundIndex !== -1) {
      return 'bot';
    }

    return 'nobot';
  })();

  function simplifyHostname(host) {
    const simplifiedName = host.replace(/^https?:\/\/([^/]+).*$/, '$1');
    return simplifiedName.split('.').slice(-2).join('.');
  }

  const referrer = (() => {
    if (document.referrer.indexOf(window.park.exports.config.consentRedirectUrl) > -1) {
      const initialReferrer = window.park.storage.get('park.consent.initialReferrer') ?
        window.park.storage.get('park.consent.initialReferrer') : window.location.host;
      window.park.storage.set('park.targeting.longreferrer', simplifyHostname(initialReferrer));
      return simplifyHostname(initialReferrer);
    }

    if (!document.referrer) {
      window.park.storage.set('park.targeting.longreferrer', simplifyHostname(window.location.host));
      return simplifyHostname(window.location.host);
    }
    const host = simplifyHostname(document.referrer);
    if (host !== simplifyHostname(window.location.host)) {
      window.park.storage.set('park.targeting.longreferrer', host);
    }
    return host;
  })();

  const longReferrer = window.park.storage.get('park.targeting.longreferrer');

  const gptSlotEvents = [
    'slotRenderEnded',
    'slotOnload',
    'impressionViewable',
    'slotRequested',
    'slotResponseReceived',
    'slotVisibilityChanged',
  ];

  const pageViewEvents = [
    'park.gallery:pageview',
    'park.search:displayresults',
  ];

  const telemetry = {
    systemInfo: {
      mobile: window.park.device.isMobile(),
      windowWidth: window.innerWidth,
      connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
      dataSavingActivated: navigator.connection ? !!navigator.connection.saveData : false,
      mainMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GiB` : 'unknown',
      cpuCores: navigator.hardwareConcurrency || 'unknown',
      userAgent: navigator.userAgent,
    },
    library: {},
    slots: {},
  };

  let refreshInterval = 5;
  let refreshCount = 0;
  let isReady = false;
  const getReadyState = () => isReady;

  if (window.ads && window.ads.reloadFrequency) {
    refreshInterval = parseInt(window.ads.reloadFrequency, 10);
  }

  function isInt(n) {
    return n % 1 === 0;
  }

  function isIndexPage() {
    return !!document.querySelector('.park-opener') &&
      !document.documentElement.classList.contains('is-advertorial');
  }

  function isArticlePage() {
    return !!document.querySelector('.park-article') &&
      !document.documentElement.classList.contains('is-advertorial');
  }

  function getAdPersonalization() {
    return window.park.storage.get('park.googlePublisherTagPersonalization');
  }

  function triggerResizeEvent(elem) {
    if (!elem) {
      return;
    }

    const event = new CustomEvent('park.portal:resize', {
      bubbles: true,
      cancelable: false,
    });

    elem.dispatchEvent(event);
  }

  function getAdConfig() {
    if (window.matchMedia || matchMedia(window.park.exports.mediaqueries.large).matches) {
      if (
        window.ads.desktop &&
        window.ads.large
      ) {
        window.park.console.info('Using GPT ad configuration for mediaquery "large".');

        const config = JSON.parse(JSON.stringify(window.ads.large));

        config.slots = Object.assign(
          {},
          JSON.parse(JSON.stringify(window.ads.desktop.slots)),
          config.slots
        );

        return config;
      }
    }

    if (!window.park.device.isMobile()) {
      window.park.console.info('Using GPT ad configuration for mediaquery "desktop".');
      return window.ads.desktop || {};
    }

    if (window.ads.mobile) {
      window.park.console.info('Using GPT ad configuration for mediaquery "mobile".');
      return window.ads.mobile;
    }

    window.park.console.info('No GPT ad slot configuration found.');
    return {};
  }

  if (!window.ads) {
    window.park.console.info('No GPT ad configuration found. Disabling ads.');
    return;
  }

  const adConfig = getAdConfig();
  const definedSlots = adConfig.slots || [];
  const createdSlots = {};
  const removedFromReloadAllList = [];

  function initSlotObject(slot) {
    if (!slot.adSlotName || !slot.adUnitPath) {
      window.park.console.info('GPT ad unsufficiently specified.');
      return;
    }

    const adSlotName = `${slot.adSlotName}`;
    const adUnitPath = slot.adUnitPath.replace(/\uD83C\uDFDE/g, '/');
    const size = slot.size;
    let defineResult = null;

    if (size) {
      defineResult = window.googletag.defineSlot(adUnitPath, size, adSlotName);
    } else {
      defineResult = window.googletag.defineOutOfPageSlot(adUnitPath, adSlotName);
    }
    if (!defineResult) {
      window.park.console.info(`GPT ad with ID "${adSlotName}" was already defined.`);
      return;
    }

    createdSlots[adSlotName] = defineResult;

    window.park.console.info(`Created GPT ad with ID "${adSlotName}".`);

    createdSlots[adSlotName].addService(window.googletag.pubads());

    if (slot.collapse) {
      createdSlots[adSlotName].setCollapseEmptyDiv(true, true);
    } else {
      createdSlots[adSlotName].setCollapseEmptyDiv(true);
    }

    // Slot specific targeting
    if (slot.targeting && typeof slot.targeting === 'object') {
      Object.keys(slot.targeting).forEach((key) => {
        const value = slot.targeting[key];

        createdSlots[adSlotName].setTargeting(key, value);
      });
    }
  }

  function initSlot(adSlotName) {
    definedSlots
      .filter(slot => !slot.stroeer)
      .filter(slot => `${slot.adSlotName}` === `${adSlotName}`)
      .forEach(initSlotObject);
  }

  function displaySlot(adSlotName) {
    const slotElem = document.getElementById(adSlotName);

    if (!slotElem) {
      if (document.readyState !== 'loading') {
        window.park.console.error(`DOM element for GPT slot with ID "${adSlotName}" did not appear`);
        return;
      }

      window.setTimeout(() => {
        displaySlot(adSlotName);
      }, 100);
      return;
    }

    window.park.console.log(`Displaying GPT slot with ID "${adSlotName}"`);
    window.googletag.cmd.push(() => {
      window.googletag.display(adSlotName);
    });
  }

  function displaySlots() {
    definedSlots
      .filter(slot => !slot.stroeer)
      .filter(slot => !slot.lazyload)
      .forEach((slot) => {
        const adSlotName = `${slot.adSlotName}`;

        displaySlot(adSlotName);
      });
  }

  function initAndDisplaySlot(adSlotName) {
    window.googletag.cmd.push(() => {
      initSlot(adSlotName);
      displaySlot(adSlotName);
    });
  }

  function gptSizeByWindowInnerSize(windowInner, gptSize) {
    let calculatedSize =
      gptSize[gptSize.indexOf(gptSize.find(element => element > windowInner)) - 1];
    if (!Number.isInteger(calculatedSize)) {
      calculatedSize = gptSize[gptSize.length - 1];
    }
    return calculatedSize.toString();
  }

  function init(callback) {
    window.park.console.info('Initializing GPT!');
    if (window.performance) {
      try {
        const libraryUrl = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
        const entries = performance
          .getEntries()
          .filter(entry => entry.name === libraryUrl);

        if (entries.length && entries[0].toJSON) {
          Object.keys(entries[0].toJSON()).forEach((key) => {
            const value = entries[0][key];

            if (
              typeof value !== 'number' ||
              isInt(value)
            ) {
              return;
            }

            telemetry.library[key] = Math.round(value) / 1000;
          });
        }
      } catch (e) {
        window.park.console.warn('Error retrieving library telemetry data');
        window.park.console.warn(e);
      }
    }

    window.googletag.cmd.push(() => {
      definedSlots
        .filter(slot => !slot.stroeer)
        .filter(slot => slot.lazyload)
        .forEach((slot) => {
          window.park.console.log(`Lazy GPT slot found: ${slot.adSlotName}`);
        });

      definedSlots
        .filter(slot => !slot.stroeer)
        .filter(slot => !slot.lazyload)
        .forEach(initSlotObject);

      // Global ad targeting
      if (adConfig.targeting && typeof adConfig.targeting === 'object') {
        Object.keys(adConfig.targeting).forEach((key) => {
          const value = adConfig.targeting[key];

          window.googletag.pubads().setTargeting(key, value);
        });
        window.googletag.pubads().setTargeting('referrer', referrer);
        window.googletag.pubads().setTargeting('longreferrer', longReferrer);
        window.googletag.pubads().setTargeting('bot', bot);
        window.googletag.pubads().setTargeting('seitenbreite', gptSizeByWindowInnerSize(window.innerWidth, gptSkyscraperWidth));
        window.googletag.pubads().setTargeting('seitenhoehe', gptSizeByWindowInnerSize(window.innerHeight, gptSkyscraperHeight));
        personalizedByPaidStatus.then((result) => {
          window.park.console.info(`NPA (${result}) ${window.park.storage.get('park.user.npa')}`);
          window.googletag.pubads().setRequestNonPersonalizedAds(window.park.storage.get('park.user.npa'));
        });
      }

      window.googletag.pubads().setTargeting('referrer', referrer);
      window.googletag.pubads().setTargeting('bot', bot);
      window.googletag.pubads().setTargeting('seitenbreite', gptSizeByWindowInnerSize(window.innerWidth, gptSkyscraperWidth));
      window.googletag.pubads().setTargeting('seitenhoehe', gptSizeByWindowInnerSize(window.innerHeight, gptSkyscraperHeight));
      personalizedByPaidStatus.then((result) => {
        window.park.console.info(`NPA (${result}) ${window.park.storage.get('park.user.npa')}`);
        window.googletag.pubads().setRequestNonPersonalizedAds(window.park.storage.get('park.user.npa'));
      });
      window.googletag.pubads().enableSingleRequest();
      window.googletag.enableServices();

      isReady = true;
    });

    if (callback) {
      callback();
    } else {
      displaySlots(definedSlots);
    }
  }

  function load(callback) {
    window.park.resourceLoader.script('https://securepubads.g.doubleclick.net/tag/js/gpt.js', callback);
  }

  function loadAndInitProcess() {
    if (window.park.exports.config.cmp !== '' && window.OptanonActiveGroups && !(window.OptanonActiveGroups.indexOf('C0004') > -1)) {
      return;
    }
    load(init);
  }

  function loadAndInit() {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(loadAndInitProcess, { timeout: 3000 });
      return;
    }
    // for all other Browsers first check if readyState is already complete
    if (document.readyState !== 'loading') {
      loadAndInitProcess();
      return;
    }
    // if readyState is not complete add an eventListener
    // eslint-disable-next-line no-unused-vars
    document.addEventListener('DOMContentLoaded', function handler(e) {
      loadAndInitProcess();
      document.removeEventListener('DOMContentLoaded', handler);
    });
  }

  gptSlotEvents.forEach((eventName) => {
    window.googletag.cmd.push(() => {
      window.googletag.pubads().addEventListener(eventName, (e) => {
        if (e.slot) {
          const slot = e.slot;
          const slotId = slot.getSlotElementId();
          const queryId = slot.getEscapedQemQueryId();
          const isEmpty = e.isEmpty;
          const isBackfill = e.isBackfill;
          const lazyload = adConfig.slots.reduce((accumulator, slot) => {
            if (slot.adSlotName === slotId && slot.lazyload) {
              accumulator = true;
            }
            return accumulator;
          }, false);
          const advertiserId = e.advertiserId;
          const campaignId = e.campaignId;
          const lineitemId = e.lineItemId;
          const creativeId = e.creativeId;
          const size = (e.size || []).join(' x ');
          const slotElem = document.getElementById(slotId);
          const loadedElement = slotElem ?
            (slotElem.querySelector('iframe, img') ||
              slotElem) : undefined;

          if (!telemetry.slots[slotId]) {
            telemetry.slots[slotId] = [];
          }
          window.park.console.log(`Slot with ID "${slotId}" threw "${eventName}" event.`);

          let loadCount = telemetry.slots[slotId].length - 1;

          if (eventName === 'slotRenderEnded') {
            loadCount += 1;
          }

          loadCount = Math.max(0, loadCount);

          if (
            !telemetry.slots[slotId][loadCount] ||
            (
              telemetry.slots[slotId][loadCount] &&
              telemetry.slots[slotId][loadCount].isEmpty &&
              !isEmpty)
          ) {
            telemetry.slots[slotId][loadCount] = !isEmpty ? {
              slotId,
              queryId,
              isEmpty,
              isBackfill,
              lazyload,
              advertiserId,
              campaignId,
              lineitemId,
              creativeId,
              size,
            } : {
              slotId,
              isEmpty,
              lazyload,
            };
          }

          if (window.performance) {
            const milliseconds = window.performance.now();
            const seconds = Math.round(milliseconds) / 1000;
            // eslint-disable-next-line max-len
            window.park.console.log(`Slot with ID "${slotId}" threw "${eventName}" event. Time taken: ${seconds} secs.`);

            if (!telemetry.slots[slotId][loadCount][eventName]) {
              telemetry.slots[slotId][loadCount][eventName] = seconds;
            }
          } else {
            window.park.console.log(`Slot with ID "${slotId}" threw "${eventName}" event.`);
          }

          if (loadedElement) {
            triggerResizeEvent(loadedElement);
          }
          /**
           * Register slotRenderEnded listener
           */
          if (eventName === 'slotRenderEnded') {
            window.park.console.log(`eventName > slotRenderEnded detected with slotid: ${e.slot.getSlotElementId()} and camoaignid ${e.campaignId}`);
            if (e.slot.getSlotElementId() && e.campaignId) {
              slotMap[e.slot.getSlotElementId()] = e.campaignId;
            }
          }
          /**
           * Register impressionViewable listener
           */
          if (eventName === 'impressionViewable') {
            const sid = e.slot.getSlotElementId();
            const cid = slotMap[sid];
            if (cid) {
              window.park.console.log(`eventName > impressionViewable detected with with slotid: ${sid} and campaignid: ${cid}`);
            }

            if (!(isIndexPage() || isArticlePage())) {
              return;
            }

            if (adreloadOrderidWhitelist.indexOf(`${cid}`) === -1) {
              return;
            }
            const slotConfig = definedSlots
              .filter(slot => !slot.stroeer)
              .filter(slot => `${slot.adSlotName}` === `${sid}`)[0];

            const adRealoadTimer = slotConfig.adReloadTimer;
            window.park.console.log(`eventName > impressionViewable detected with adRealoadTimer: ${adRealoadTimer}`);
            if (typeof adRealoadTimer !== 'undefined') {
              if (parseInt(adRealoadTimer, 10) !== 0) {
                const timeout = 1000 * slotConfig.adReloadTimer;
                setTimeout((s) => {
                  window.park.googlePublisherTag.reload(s);
                }, timeout, sid);
              }
            }
          }
        }
      });
    });
  });

  pageViewEvents.forEach((eventName) => {
    document.addEventListener(eventName, () => {
      refreshCount += 1;

      if (refreshCount % refreshInterval === 0) {
        window.park.googlePublisherTag.reloadAll();
      }
    });
  });

  document.addEventListener('park.portal:reload', (e) => {
    const adSlotName = e.detail.adSlotName;

    window.park.googlePublisherTag.reload(adSlotName);
  });

  document.addEventListener('park.portal:removefromreloadalllist', (e) => {
    const adSlotName = e.detail.adSlotName;

    window.park.googlePublisherTag.removeFromReloadAllList(adSlotName);
  });

  window.park = Object.assign({}, window.park, {
    googlePublisherTag: {
      init,
      load,
      displaySlots,
      loadAndInit,
      displaySlot,
      initAndDisplaySlot,
      setAdPersonalization: (pref) => {
        window.park.storage.set(
          'park.googlePublisherTagPersonalization',
          !!(pref !== 'false' && pref !== false && pref)
        );
      },
      getAdPersonalization,
      reload: (adSlotName) => {
        window.googletag.pubads().clearTargeting('skystopp');

        if (createdSlots[`${adSlotName}`]) {
          window.googletag.pubads().refresh([createdSlots[adSlotName]]);
        }

        window.park.console.log(`Triggered GPT ad refresh for Slot ID "${adSlotName}"`);
      },
      reloadAll: () => {
        if (window.googletag && window.googletag.pubads) {
          Object.assign(document.body.style, {
            backgroundColor: '',
            backgroundImage: '',
          });

          Object.assign(document.querySelector('body'), {
            backgroundColor: '',
            backgroundImage: '',
          });

          const slots = Object.keys(createdSlots)
            .filter(adSlotName => removedFromReloadAllList.indexOf(adSlotName) === -1)
            .map(adSlotName => createdSlots[adSlotName]);

          window.googletag.pubads().clearTargeting('skystopp');
          window.googletag.pubads().refresh(slots);

          window.park.console.log('Triggered GPT ad refresh for all GPT slots');
        }
      },
      removeFromReloadAllList: (adSlotName) => {
        removedFromReloadAllList.push(adSlotName);
      },
      slots: createdSlots,
      telemetry,
      isReady: getReadyState,
      globalRefreshSlots: () => Object.keys(createdSlots)
        .filter(adSlotName => removedFromReloadAllList.indexOf(adSlotName) === -1)
        .map(adSlotName => createdSlots[adSlotName]),
    },
  });
})();

