(() => {
  const isClickDummy = (
    window.park.exports &&
    window.park.exports.config &&
    window.park.exports.config.isClickDummy
  );

  function checkData(data) {
    let valid = true;

    if (!data) {
      window.park.console.error('Cannot track pageview on IVW as iam_data config is missing');
      valid = false;
    }

    ['mobile', 'desktop'].forEach((deviceType) => {
      if (!data[deviceType]) {
        window.park.console.error(`Cannot track pageview on IVW as iam_data config is missing "${deviceType}" property`);
        valid = false;
      }

      ['st', 'cp', 'sv', 'co'].forEach((property) => {
        if (data[deviceType] && !data[deviceType][property]) {
          window.park.console.error(`Cannot track pageview on IVW as "${deviceType}" config lacks the following sub-property: "${property}".`);
          valid = false;
        }
      });
    });

    return valid;
  }

  function track(data) {
    if (!window.iom) {
      window.park.console.error('Cannot track on IVW as iom object is missing');
    }

    if (window.iom) {
      if (!window.park.device.isMobile()) {
        const trackingData = Object.assign({}, data.desktop);

        if (isClickDummy) {
          trackingData.xp = trackingData.cp;

          delete trackingData.cp;
        }

        window.iom.count(trackingData, 1);
        window.park.console.info('Successfully tracked a desktop impression on IVW');
      } else {
        const trackingData = Object.assign({}, data.mobile);

        if (isClickDummy) {
          trackingData.xp = trackingData.cp;

          delete trackingData.cp;
        }

        window.iom.hybrid(trackingData, 1);
        window.park.console.info('Successfully tracked a mobile impression on IVW');
      }
    }
  }

  window.park = Object.assign({}, window.park, {
    ivw: {
      trackPageView() {
        try {
          const data = JSON.parse(JSON.stringify(window.iam_data));
          const fakeBody = document.querySelector('.park-fakebody');

          if (!fakeBody) {
            window.setTimeout(window.park.ivw.trackPageView, 100);
            return;
          }

          if (!checkData(data)) {
            return;
          }

          track(data);
        } catch (e) {
          window.park.console.warn('Error tracking IVW pageview due to missing iam data');
        }
      },
      trackVideoPlay() {
        try {
          const data = JSON.parse(JSON.stringify(window.iam_data));
          const fakeBody = document.querySelector('.park-fakebody');

          if (!fakeBody) {
            window.setTimeout(window.park.ivw.trackPageView, 100);
            return;
          }

          if (!checkData(data)) {
            return;
          }

          data.mobile.cp += '-Video';
          data.desktop.cp += '-Video';

          track(data);
        } catch (e) {
          window.park.console.warn('Error tracking IVW pageview due to missing iam data');
        }
      },
      trackSearchResult() {
        this.trackPageView();
      },
    },
  });
})();
