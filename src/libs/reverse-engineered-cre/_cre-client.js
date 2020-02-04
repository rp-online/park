/* eslint-disable no-underscore-dangle */
window.cre_client = (function () {
  const _ = this;
  const trackingApiUrl = '//www.rp-online.de/cre-1.0/tracking/call.js';
  const deviceApiUrl = '//www.rp-online.de/cre-1.0/tracking/device.js';
  const g = '100';
  const f = 'false';
  const h = f === 'true';

  let listeners = [];
  let data = {};

  const CreClient = function () {
    function getCookieValue(key) {
      for (let n = `${key}=`, a = document.cookie.split(';'), t = 0; a.length > t; t++) {
        for (var i = a[t]; i.charAt(0) == ' ';) i = i.substring(1, i.length);
        if (i.indexOf(n) == 0) return i.substring(n.length, i.length);
      }
      return null;
    }

    function isValidCreId() {
      const creid = getCookieValue('creid');

      if (!creid) {
        return false;
      }

      const lastThreeDigits = parseInt(creid.split('').slice(creid.length - 3).join(''), 10);
      const modulo = lastThreeDigits % 100;

      return parseInt(g, 10) >= modulo;
    }

    function removeJsonpScript(jsonpCallback, jsonpId) {
      const jsonpElem = document.getElementById(`jsonp_${jsonpId}`);

      if (jsonpElem && jsonpElem.parentNode) {
        jsonpElem.parentNode.removeChild(jsonpElem);
      }

      window[jsonpCallback] = undefined;
    }

    function log(e, n) {
      if (_.debug) {
        console.log(`[DEBUG] ${e}: ${JSON.stringify(n)}`);
        return undefined;
      }
      return null;
    }

    function addJsonpScript(url, jsonpId) {
      const script = document.createElement('script');
      script.async = true;
      script.src = url;
      script.id = `jsonp_${jsonpId}`;

      log('Requested script', script.src);

      const head = document.head || document.getElementsByTagName('head')[0];

      if (head) {
        head.appendChild(script);
      } else {
        document.body.appendChild(script);
      }
    }

    function processResponse(e) {
      if (!h || _.debug) {
        const previousListeners = listeners;

        listeners = [];
        data = {};

        for (let a = 0; previousListeners.length > a; a += 1) {
          try {
            previousListeners[a](e);
          } catch (err) {
            console.error(err);
          }
        }
        log('Requesting offer for', e);
      }
    }

    function getParam(e) {
      const n = {};
      _.getParams().replace(RegExp('([^?=&]+)(=([^&]*))?', 'g'), (e, a, t, i) => {
        n[a] = i;
      });
      const a = n[e];
      return a != null ? a : '';
    }

    function isUserOptedOut() {
      return getCookieValue('CREOptOut') === 'true';
    }

    function buildQueryString() {
      const keyvaluePairs = [];

      Object.keys(data).forEach((key) => {
        const value = encodeURIComponent(data[key]);

        if (value !== '') {
          keyvaluePairs.push(`${key}=${value}`);
        }
      });

      return `?${keyvaluePairs.join('&')}`;
    }

    function createSetterMethods() {
      [
        {
          name: 'service_id',
          internalName: 'serviceid',
        },
        {
          name: 'origin',
          internalName: 'origin',
        },
        {
          name: 'doc_type',
          internalName: 'doctype',
        },
        {
          name: 'content_id',
          internalName: 'contentid',
        },
        {
          name: 'cms_id',
          internalName: 'cms_id',
        },
        {
          name: 'channel',
          internalName: 'channel',
        },
        {
          name: 'sub_channel',
          internalName: 'subchannel',
        },
        {
          name: 'sub_sub_channel',
          internalName: 'subsubchannel',
        },
        {
          name: 'heading',
          internalName: 'heading',
        },
        {
          name: 'kicker',
          internalName: 'kicker',
        },
        {
          name: 'video_length',
          internalName: 'length',
        },
        {
          name: 'video_auto_play',
          internalName: 'autoplay',
        },
        {
          name: 'video_position',
          internalName: 'position',
        },
        {
          name: 'site',
          internalName: 'site',
        },
        {
          name: 'tag',
          internalName: 'tag',
        },
        {
          name: 'entitlement',
          internalName: 'entitlement',
        },
        {
          name: 'offer_ids',
          internalName: 'offerids',
        },
        {
          name: 'variant_ids',
          internalName: 'variantids',
        },
        {
          name: 'disrupter_ids',
          internalName: 'disrupterids',
        },
        {
          name: 'global_variant_id',
          internalName: 'globalvariant',
        },
        {
          name: 'payment_method',
          internalName: 'paymenttype',
        },
        {
          name: 'entitlement_id',
          internalName: 'entitlementid',
        },
        {
          name: 'element_id',
          internalName: 'elementid',
        },
        {
          name: 'store_id',
          internalName: 'storeid',
        },
        {
          name: 'ab_test_id',
          internalName: 'abtestid',
        },
        {
          name: 'ab_test_variant_id',
          internalName: 'abtestvariantid',
        },
        {
          name: 'adblocker',
          internalName: 'adblocker',
        },
        {
          name: 'page_view',
          internalName: 'pageview',
          key: 'action',
        },
        {
          name: 'page_complete',
          internalName: 'pagecomplete',
          key: 'action',
        },
        {
          name: 'video_start',
          internalName: 'videostart',
          key: 'action',
        },
        {
          name: 'video_content_start',
          internalName: 'videostart',
          key: 'action',
        },
        {
          name: 'video_ping',
          internalName: 'videoposition',
          key: 'action',
        },
        {
          name: 'video_end',
          internalName: 'videoend',
          key: 'action',
        },
        {
          name: 'app_start',
          internalName: 'app_start',
          key: 'action',
        },
        {
          name: 'app_stop',
          internalName: 'app_stop',
          key: 'action',
        },
        {
          name: 'app_background',
          internalName: 'app_background',
          key: 'action',
        },
        {
          name: 'app_foreground',
          internalName: 'app_foreground',
          key: 'action',
        },
      ].forEach((entry) => {
        const name = entry.name;
        const internalName = entry.internalName;

        _[`set_${name}`] = (newValue) => {
          if (entry.key !== undefined) {
            data[entry.key] = internalName;
          } else {
            data[internalName] = newValue;
          }
        };
      });
    }

    function l(e) {
      if (document.readyState !== 'loading') {
        init(e);
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          init(e);
        }, false);
      }
    }

    function getDPI(CSSProperty) {
      const div = document.createElement('div');

      div.style[CSSProperty] = '1in';

      const body = document.getElementsByTagName('body')[0];

      body.appendChild(div);

      const computedStyle = document
        .defaultView
        .getComputedStyle(div, null).getPropertyValue(CSSProperty);

      body.removeChild(div);

      return parseFloat(computedStyle);
    }

    function init(e) {
      if (e && e.data) {
        const a = e.data;
        if (a.stream_status === 'created' || a.stream_status === 'inactive' || a.stream_status === 'unknown_device') {
          const screen = window.screen;

          data.width = screen.width;
          data.height = screen.height;
          data.dpi_x = getDPI('width');
          data.dpi_y = getDPI('height');
          data.tracking_id = data.tracking_id || a.tracking_id;

          const jsonpId = Math.floor(1e5 * Math.random());
          const jsonpCallback = `cre_callback_${jsonpId}`;

          data._c = jsonpCallback;

          const queryString = buildQueryString();

          addJsonpScript(deviceApiUrl + queryString, jsonpCallback);

          window[jsonpCallback] = () => {
            removeJsonpScript(jsonpCallback, jsonpId);
          };
        }
      }
    }

    this.debug = document.cookie.indexOf('cre_debug=1') !== -1;

    createSetterMethods();

    this.request = () => {
      if (!isUserOptedOut() && isValidCreId()) {
        data._u = window.location.href;
        data._r = document.referrer;

        const jsonpId = Math.floor(1e5 * Math.random());
        const jsonpCallback = `cre_callback_${jsonpId}`;

        window[jsonpCallback] = (response) => {
          processResponse(response);
          removeJsonpScript(jsonpCallback, jsonpId);
          l(response);
        };

        data._c = jsonpCallback;
        data._kid = getParam('kid');
        data._wid = getParam('wid');
        data.oldbrowser = !!window.oldbrowser;

        const queryString = buildQueryString();
        return addJsonpScript(trackingApiUrl + queryString, jsonpId);
      }
    };

    this.addListener = (e) => {
      listeners.push(e);
    };

    this.getParams = () => {
      return window.location.search;
    };
  };

  return new CreClient();
}());
