(() => {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];

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
  const referrer = (() => {
    if (
      !document.referrer
    ) {
      return '';
    }

    const host = document.referrer.replace(/^https?:\/\/([^/]+).*$/, '$1');

    return host.split('.').slice(-2).join('.');
  })();

  const gptSlotEvents = [
    'slotRenderEnded',
    'slotOnload',
    'impressionViewable',
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
        console.warn('Error retrieving library telemetry data');
        console.warn(e);
      }
    }

    window.googletag.cmd.push(() => {
      definedSlots
        .filter(slot => !slot.stroeer)
        .filter(slot => slot.lazyload)
        .forEach((slot) => {
          console.log(`Lazy GPT slot found: ${slot.adSlotName}`);
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
        window.googletag.pubads().setTargeting('bot', bot);
        window.googletag.pubads().setTargeting('seitenbreite', `${window.innerWidth}`);
        window.googletag.pubads().setTargeting('seitenhoehe', `${window.innerHeight}`);
      }

      // Enable or disable ad personalization
      const pref = getAdPersonalization();

      // 0 = personalized
      // 1 = non-personalized
      window.googletag.pubads()
        .setRequestNonPersonalizedAds(pref === false ? 1 : 0);
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

  function loadAndInit() {
    load(init);
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
          const loadedElement = slotElem ? (slotElem.querySelector('iframe, img') || slotElem) : undefined;

          if (!telemetry.slots[slotId]) {
            telemetry.slots[slotId] = [];
          }

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

            window.park.console.log(`Slot with ID "${e.slot.getSlotElementId()}" threw "${eventName}" event. Time taken: ${seconds} secs.`);

            if (!telemetry.slots[slotId][loadCount][eventName]) {
              telemetry.slots[slotId][loadCount][eventName] = seconds;
            }
          } else {
            window.park.console.log(`Slot with ID "${e.slot.getSlotElementId()}" threw "${eventName}" event.`);
          }

          if (loadedElement) {
            triggerResizeEvent(loadedElement);
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
