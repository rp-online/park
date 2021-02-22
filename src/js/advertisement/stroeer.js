(() => {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];

  const configuredSlots = [];
  const removedFromReloadAllList = [];
  const pageViewEvents = [
    'park.gallery:pageview',
    'park.search:displayresults',
  ];
  const source = (() => {
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

    if (!window.navigator || !window.navigator.userAgent) {
      return 'nobot';
    }
    const userAgentNormalized = window.navigator.userAgent.toLowerCase();
    if (userAgentNormalized.indexOf('googlebot') !== -1) {
      return 'gobot';
    }

    if (userAgentNormalized.indexOf('bot') !== -1 || userAgentNormalized.indexOf('spider') !== -1) {
      return 'bot';
    }

    const foundIndex = bots.findIndex(bot => userAgentNormalized.indexOf(bot.toLowerCase()) !== -1);
    if (foundIndex !== -1) {
      return 'bot';
    }

    return 'nobot';
  })();
  const lead = (() => {
    if (
      !document.referrer
    ) {
      return '';
    }

    const host = document.referrer.replace(/^https?:\/\/([^/]+).*$/, '$1');

    return host.split('.').slice(-2).join('.');
  })();
  let loadedSlotsCount = 0;
  let gptInitializationTimer;
  let gptInitialized = false;
  let refreshInterval = 3;
  let refreshCount = 0;

  if (window.ads && window.ads.reloadFrequency) {
    refreshInterval = parseInt(window.ads.reloadFrequency, 10);
  }

  Object.defineProperty(window, 'sdgStickyNaviHeight', {
    get: () => {
      if (document.documentElement.classList.contains('with-offers')) {
        if (window.park.device.isMobile()) {
          return (58 + 114);
        }
        return (58 + 58);
      }
      return 58;
    },
  });

  function initGPT() {
    if (gptInitialized) {
      return;
    }

    gptInitialized = true;
    window.park.googlePublisherTag.init();
  }

  function enqueueGPT() {
    window.addEventListener('metaTagSystemSlotDone', () => {
      window.park.console.log('A Stroeer slot has loaded');
      loadedSlotsCount += 1;

      window.clearTimeout(gptInitializationTimer);
      gptInitializationTimer = window.setTimeout(initGPT, 2000);

      if (loadedSlotsCount >= Math.min(2, configuredSlots.length)) {
        window.park.console.log(`${loadedSlotsCount} configured Stroeer slots have loaded`);
        window.clearTimeout(gptInitializationTimer);
        initGPT();
      }
    });
  }

  function adjustSizes(slot, registeredSlot) {
    window.park.console.info(`Found sizes whitelist for Stroeer Metatag ad with ID "${slot.adSlotName}".`);

    try {
      const whiteListedSizes = slot.size;

      /* eslint-disable no-underscore-dangle */
      const configuredSizes = window
        .SDG
        .Publisher
        .getConfig()
        ._config
        .positions[slot.adSlotName]
        .dfpSizes
        .slice(0);

      window.park.console.log(configuredSizes);

      configuredSizes.forEach((configuredSize) => {
        const index = whiteListedSizes.findIndex(
          whiteListedSize => whiteListedSize[0] === configuredSize[0] &&
            whiteListedSize[1] === configuredSize[1]
        );

        if (index === -1) {
          window.park.console.info(`Removed size [${configuredSize[0]}, ${configuredSize[1]}] from Stroeer Metatag ad with ID "${slot.adSlotName}".`);
          registeredSlot.removeSizes([configuredSize]);
        }
      });
    } catch (e) {
      window.park.console.error(`Failed to adjust sizes for Stroeer Metatag ad with ID "${slot.adSlotName}".`);
    }

    return registeredSlot;
  }

  function init() {
    function getAdConfig() {
      if (window.matchMedia || matchMedia(window.park.exports.mediaqueries.large).matches) {
        if (
          window.ads.desktop &&
          window.ads.large
        ) {
          window.park.console.info('Using Stroeer Metatag ad configuration for mediaquery "large".');

          const config = JSON.parse(JSON.stringify(window.ads.large));

          config.slots = Object.assign({},
            JSON.parse(JSON.stringify(window.ads.desktop.slots)),
            config.slots
          );

          return config;
        }
      }

      if (!window.park.device.isMobile()) {
        window.park.console.info('Using Stroeer Metatag ad configuration for mediaquery "desktop".');
        return window.ads.desktop || {};
      }

      if (window.ads.mobile) {
        window.park.console.info('Using ad Stroeer Metatag configuration for mediaquery "mobile".');
        return window.ads.mobile;
      }

      window.park.console.info('No Stroeer Metatag ad slot configuration found.');
      return {};
    }

    if (!window.ads) {
      window.park.console.info('No Stroeer Metatag ad configuration found. Disabling ads.');
      return;
    }

    const adConfig = getAdConfig();

    if (!window.SDG) {
      window.park.console.info('No Stroeer SDG found.');
      return;
    }

    if (typeof window.OnetrustActiveGroups !== 'undefined') {
      window.SDG.Publisher.setAdServerConsent(window.OnetrustActiveGroups.match(/,C0004,/) !== null);
    }

    if (adConfig.zone) {
      window.SDG.Publisher.setZone(adConfig.zone);
    }

    if (adConfig.subZone) {
      window.SDG.Publisher.addSubZone(adConfig.subZone);
    }

    if (adConfig.keywords) {
      window.SDG.Publisher.addKeywords(adConfig.keywords);
    }

    if (source) {
      window.SDG.Publisher.addKeyValue('source', source);
    }

    if (lead) {
      window.SDG.Publisher.addKeyValue('lead', lead);
    }

    if (adConfig.keyValues) {
      window.SDG.Publisher.addKeyValues(adConfig.keyValues);
    }

    if (adConfig.slots) {
      adConfig.slots
        .filter(slot => slot.stroeer)
        .map((slot) => {
          if (slot.adSlotName) {
            configuredSlots.push(slot.adSlotName.replace(/[-_]+(\d+)$/, '$1'));
          }

          return slot;
        })
        .filter(slot => !slot.lazyload)
        .forEach((slot) => {
          if (!slot.adSlotName) {
            return;
          }

          const slotID = slot.adSlotName.replace(/[-_]+(\d+)$/, '$1');
          const containerID = slot.adSlotName;

          if (!window.SDG) {
            return;
          }

          let registeredSlot = window
            .SDG
            .Publisher
            .registerSlot(slotID, containerID);

          if (!registeredSlot) {
            return;
          }

          if (slot.targeting && typeof slot.targeting === 'object') {
            Object.keys(slot.targeting).forEach((key) => {
              const value = {};

              if (typeof slot.targeting[key] === 'object') {
                value[key] = slot.targeting[key];
              } else {
                value[key] = [slot.targeting[key]];
              }

              registeredSlot.setTargeting(value);
            });
          }

          if (slot.size && slot.size.forEach && slot.size.length) {
            registeredSlot = adjustSizes(slot, registeredSlot);
          }

          registeredSlot.load();

          window.park.console.info(`Initialized Stroeer Metatag ad with ID "${slotID}".`);
        });
    }

    window.SDG.Publisher.finalizeSlots();

    if (window.park.googlePublisherTag && window.park.googlePublisherTag.init) {
      if (!configuredSlots.length) {
        initGPT();
        return;
      }

      window.park.console.info('Waiting for two Stroeer slots to load before GPT is initialized as well.');

      // Wait for all Stroeer slots to load before handing over to GPT
      enqueueGPT();

      // Fallback for when GPT initialization is not called be the former
      gptInitializationTimer = window.setTimeout(initGPT, 2000);
    }
  }

  pageViewEvents.forEach((eventName) => {
    document.addEventListener(eventName, () => {
      refreshCount += 1;

      if (refreshCount % refreshInterval === 0) {
        window.park.stroeer.reloadAll();
      }
    });
  });

  document.addEventListener('park.portal:reload', (e) => {
    const adSlotName = e.detail.adSlotName;

    window.park.stroeer.reload(adSlotName);
  });

  document.addEventListener('park.portal:removefromreloadalllist', (e) => {
    const adSlotName = e.detail.adSlotName;

    window.park.stroeer.removeFromReloadAllList(adSlotName);
  });

  window.park = Object.assign({}, window.park, {
    stroeer: {
      init,
      reload: (adSlotName) => {
        if (!adSlotName) {
          return;
        }

        const slotID = adSlotName.replace(/[-_]+(\d+)$/, '$1');

        if (!window.SDG) {
          return;
        }

        window.SDG.Publisher.loadMultipleSlots([slotID]);

        window.park.console.log(`Triggered Stroeer Metatag ad refresh for Slot ID "${slotID}"`);
      },
      reloadAll: () => {
        const omsvSkyDhtmlLayer = document.getElementById('omsv_sky_DhtmlLayer');

        if (omsvSkyDhtmlLayer) {
          omsvSkyDhtmlLayer.parentNode.removeChild(omsvSkyDhtmlLayer);
        }

        Object.assign(document.body.style, {
          backgroundColor: '',
          backgroundImage: '',
        });

        Object.assign(document.querySelector('body'), {
          backgroundColor: '',
          backgroundImage: '',
        });

        const whitelistedSlots = configuredSlots
          .filter(adSlotName => removedFromReloadAllList.indexOf(adSlotName) === -1);

        if (!window.SDG) {
          return;
        }

        window.SDG.Publisher.loadMultipleSlots(whitelistedSlots);

        window.park.console.log(`Triggered Stroeer Metatag ad refresh for all whitelisted Stroeer slots: ${whitelistedSlots.join(', ')}`);
      },
      removeFromReloadAllList: (adSlotName) => {
        if (!adSlotName) {
          return;
        }

        removedFromReloadAllList.push(adSlotName.replace(/[-_]+(\d+)$/, '$1'));
      },
      slots: configuredSlots,
      globalRefreshSlots: () => configuredSlots
        .filter(adSlotName => removedFromReloadAllList.indexOf(adSlotName) === -1),
    },
  });

  function initStroeer() {
    if (window.park.exports.config.cmp !== '' && window.OptanonActiveGroups && !(window.OptanonActiveGroups.indexOf('C0004') > -1) && !window.SDG) {
      setTimeout(initStroeer, 250);
    } else if (typeof window.SDG === 'object') {
      window.park.stroeer.init();
    } else {
      setTimeout(initStroeer, 250);
    }
  }

  initStroeer();
})();
