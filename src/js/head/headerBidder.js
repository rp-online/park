/* eslint no-underscore-dangle: 0 */
(() => {
  function loadAndInit() {
    let gptInitialized = false;

    function normalizeHeaderBidderConfig(headerBidderConfig) {
      if (
        typeof headerBidderConfig === 'object' &&
        !Array.isArray(headerBidderConfig) &&
        !headerBidderConfig.provider
      ) {
        return headerBidderConfig;
      }

      if (
        typeof headerBidderConfig === 'object' &&
        headerBidderConfig.provider &&
        headerBidderConfig.id
      ) {
        const headerBidderConfigMap = {};

        headerBidderConfigMap[headerBidderConfig.provider] = headerBidderConfig.id;

        return headerBidderConfigMap;
      }

      return false;
    }

    function getHeaderBidderConfig() {
      if (!window.park.device.isMobile()) {
        if (window.ads.desktop && window.ads.desktop.headerBidder) {
          window.park.console.info('Using headerBidder configuration for mediaquery "desktop".');
          return normalizeHeaderBidderConfig(window.ads.desktop.headerBidder);
        }

        window.park.console.info('No headerBidder configuration for mediaquery "desktop" found.');
        return false;
      }

      if (window.ads.mobile && window.ads.mobile.headerBidder) {
        window.park.console.info('Using headerBidder configuration for mediaquery "mobile".');
        return normalizeHeaderBidderConfig(window.ads.mobile.headerBidder);
      }

      window.park.console.info('No headerBidder configuration for mediaquery "mobile" found.');
      return false;
    }

    function getHeaderBidderTimeoutConfig() {
      if (!window.park.device.isMobile()) {
        if (window.ads.desktop && window.ads.desktop.headerBidderTimeout) {
          return parseInt(window.ads.desktop.headerBidderTimeout, 10);
        }

        return 500;
      }

      if (window.ads.mobile && window.ads.mobile.headerBidderTimeout) {
        return parseInt(window.ads.mobile.headerBidderTimeout, 10);
      }

      return 500;
    }

    function getSlotsConfig() {
      if (!window.park.device.isMobile()) {
        if (window.ads.desktop && window.ads.desktop.slots) {
          return window.ads.desktop.slots;
        }
      }

      if (window.ads.mobile && window.ads.mobile.slots) {
        return window.ads.mobile.slots;
      }

      window.park.console.info('No GPT ad slot configuration found.');
      return {};
    }

    function loadGPT(callback) {
      if (gptInitialized) {
        return;
      }

      gptInitialized = true;
      window.park.googlePublisherTag.load(callback);
    }

    const headerBidderConfig = getHeaderBidderConfig();
    const headerBidderTimeoutConfig = getHeaderBidderTimeoutConfig();

    if (!headerBidderConfig) {
      window.park.googlePublisherTag.loadAndInit();
      return;
    }

    switch (true) {
      case (!!headerBidderConfig.pubmatic && !!headerBidderConfig.amazon):
        (() => {
          window.park.console.info('Pubmatic + Amazon header bidder config found.');

          const pageUrl = window.location.href;
          let profileVersionId = '';
          let notifyId;

          window.PWT = {
            jsLoaded: () => {
              loadGPT();
            },
          };
          window.googletag = window.googletag || {};
          window.googletag.cmd = window.googletag.cmd || [];

          if (pageUrl.indexOf('pwtv=') > -1) {
            const regexp = /pwtv=(.*?)(&|$)/g;
            const matches = regexp.exec(pageUrl);
            if (matches.length >= 2 && matches[1].length > 0) {
              profileVersionId = `/${matches[1]}`;
            }
          }

          // URL is constructed like this:
          // https://ads.pubmatic.com/AdServer/js/pwt/[pwtpubid]/[pwtprofid]/[pwtverid]/pwt.js
          // So headerBidderConfig.id should be like "https://ads.pubmatic.com/AdServer/js/pwt/9999/123/1/pwt.js"
          const pubmaticUrl = headerBidderConfig.pubmatic
            .replace(/\uD83C\uDFDE/g, '/')
            .replace('/pwt.js', `${profileVersionId}/pwt.js`);

          // Amazon A9
          /* eslint-disable */
          !function(a9,a,p,s,t,A,g){if(a[a9])return;function q(c,r){a[a9]._Q.push([c,r])}a[a9]={init:function(){q("i",arguments)},fetchBids:function(){q("f",arguments)},setDisplayBids:function(){},_Q:[]};A=p.createElement(s);A.async=!0;A.src=t;g=p.getElementsByTagName(s)[0];g.parentNode.insertBefore(A,g)}("apstag",window,document,"script","//c.amazon-adsystem.com/aax2/apstag.js");
          /* eslint-enable */

          window.apstag.init({
            pubID: `${headerBidderConfig.amazon}`,
            adServer: 'googletag',
          });

          const slots = getSlotsConfig();

          window.park.resourceLoader.script(pubmaticUrl).then(() => {
            window.apstag.fetchBids({
              slots: slots.reduce((accumulator, slot) => {
                accumulator.push({
                  slotID: slot.adSlotName,
                  sizes: slot.size,
                });

                return accumulator;
              }, []),
              timeout: headerBidderTimeoutConfig,
            }, () => {
              window.googletag.cmd.push(() => {
                window.apstag.setDisplayBids();

                window.OWT.notifyExternalBiddingComplete(notifyId);
              });
            });

            window.park.googlePublisherTag.init(() => {
              notifyId = window.OWT.registerExternalBidders(
                slots.reduce((accumulator, slot) => {
                  accumulator.push(slot.adSlotName);

                  return accumulator;
                }, [])
              );
            });
          }).catch(() => {
            loadGPT();
          });

          // Create a race condition where GPT definitely kicks off after 500ms
          window.setTimeout(() => {
            loadGPT();
          }, headerBidderTimeoutConfig);
        })();
        break;

      case (!!headerBidderConfig.pubmatic && !headerBidderConfig.amazon):
        (() => {
          window.park.console.info('Pubmatic header bidder config found.');

          const pageUrl = window.location.href;
          let profileVersionId = '';

          window.PWT = {
            jsLoaded: () => {
              loadGPT();
            },
          };
          window.googletag = window.googletag || {};
          window.googletag.cmd = window.googletag.cmd || [];

          if (pageUrl.indexOf('pwtv=') > -1) {
            const regexp = /pwtv=(.*?)(&|$)/g;
            const matches = regexp.exec(pageUrl);
            if (matches.length >= 2 && matches[1].length > 0) {
              profileVersionId = `/${matches[1]}`;
            }
          }

          // URL is constructed like this:
          //
          // https://ads.pubmatic.com/AdServer/js/pwt/[pwtpubid]/[pwtprofid]/[pwtverid]/pwt.js
          //
          // So headerBidderConfig.id should be like "https://ads.pubmatic.com/AdServer/js/pwt/9999/123/1/pwt.js"
          const url = headerBidderConfig.pubmatic
            .replace(/\uD83C\uDFDE/g, '/')
            .replace('/pwt.js', `${profileVersionId}/pwt.js`);

          window.park.googlePublisherTag.init();
          window.park.resourceLoader.script(url);

          // Create a race condition where GPT definitely kicks off after 500ms
          window.setTimeout(() => {
            loadGPT();
          }, headerBidderTimeoutConfig);
        })();
        break;

      default:
        window.park.console.info('No known headerBidder provider found.');
        window.park.googlePublisherTag.loadAndInit();
        break;
    }
  }

  window.park = Object.assign({}, window.park, {
    headerBidder: {
      loadAndInit,
    },
  });
})();
