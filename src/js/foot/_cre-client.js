/* eslint-disable */
(() => {
  const fallbacks = [];
window.cre_client = function () {
  if (!window.cre) {
    return;
  }
  var e = function () {
    function e() {
      var e = a("creid");
      if (!e) return !0;
      var n = parseInt(e.split("").slice(e.length - 3).join("")) % 100;
      return parseInt(g, 10) >= n
    }

    function n(e, n) {
      var a = document.getElementById("jsonp_" + n);
      a && a.parentNode && a.parentNode.removeChild(a), window[e] = void 0
    }

    function a(e) {
      for (var n = e + "=", a = document.cookie.split(";"), t = 0; a.length > t; t++) {
        for (var i = a[t]; " " == i.charAt(0);) i = i.substring(1, i.length);
        if (0 == i.indexOf(n)) return i.substring(n.length, i.length)
      }
      return null
    }

    function t(e, n) {
      return _.debug ? (console.log("[DEBUG] " + e + ": " + JSON.stringify(n)), void 0) : null
    }

    function createCallJsonPScriptElement(e, n) {
      var a = document.createElement("script");
      a.async = !0, a.src = e, a.id = "jsonp_" + n, t("Requested script", a.src);
      a.onerror = () => {
        console.error('call.js could not be loaded');
        var fallback;
        while (fallback = fallbacks.pop()) {
          fallback();
        }
      };
      var i = document.head || document.getElementsByTagName("head")[0];
      i ? i.appendChild(a) : document.body.appendChild(a)
    }

    function r(e) {
      if (!h || _.debug) {
        var n = N;
        N = [], y = {};
        for (var a = 0; n.length > a; a++) try {
          n[a](e)
        } catch (i) {
          console.error(i)
        }
        t("Requesting offer for", e)
      }
    }

    function o(e) {
      var n = {};
      _.getParams().replace(RegExp("([^?=&]+)(=([^&]*))?", "g"), function (e, a, t, i) {
        n[a] = i
      });
      var a = n[e];
      return null != a ? a : ""
    }

    function d() {
      return "true" === a("CREOptOut")
    }

    function m() {
      var e = [];
      for (var n in y) if (y.hasOwnProperty(n)) {
        var a = encodeURIComponent(y[n]);
        "" !== a && e.push(n + "=" + a)
      }
      return "?" + e.join("&")
    }

    function c() {
      for (var e = [{name: "service_id", internalName: "serviceid"}, {
        name: "origin",
        internalName: "origin"
      }, {name: "doc_type", internalName: "doctype"}, {name: "content_id", internalName: "contentid"}, {
        name: "cms_id",
        internalName: "cms_id"
      }, {name: "channel", internalName: "channel"}, {
        name: "sub_channel",
        internalName: "subchannel"
      }, {name: "sub_sub_channel", internalName: "subsubchannel"}, {
        name: "heading",
        internalName: "heading"
      }, {name: "kicker", internalName: "kicker"}, {
        name: "video_length",
        internalName: "length"
      }, {name: "video_auto_play", internalName: "autoplay"}, {
        name: "video_position",
        internalName: "position"
      }, {name: "site", internalName: "site"}, {name: "tag", internalName: "tag"}, {
        name: "entitlement",
        internalName: "entitlement"
      }, {name: "offer_ids", internalName: "offerids"}, {
        name: "variant_ids",
        internalName: "variantids"
      }, {name: "disrupter_ids", internalName: "disrupterids"}, {
        name: "global_variant_id",
        internalName: "globalvariant"
      }, {name: "payment_method", internalName: "paymenttype"}, {
        name: "entitlement_id",
        internalName: "entitlementid"
      }, {name: "element_id", internalName: "elementid"}, {
        name: "store_id",
        internalName: "storeid"
      }, {name: "ab_test_id", internalName: "abtestid"}, {
        name: "ab_test_variant_id",
        internalName: "abtestvariantid"
      }, {name: "adblocker", internalName: "adblocker"}, {
        name: "page_view",
        internalName: "pageview",
        key: "action"
      }, {name: "page_complete", internalName: "pagecomplete", key: "action"}, {
        name: "video_start",
        internalName: "videostart",
        key: "action"
      }, {name: "video_content_start", internalName: "videostart", key: "action"}, {
        name: "video_ping",
        internalName: "videoposition",
        key: "action"
      }, {name: "video_end", internalName: "videoend", key: "action"}, {
        name: "app_start",
        internalName: "app_start",
        key: "action"
      }, {name: "app_stop", internalName: "app_stop", key: "action"}, {
        name: "app_background",
        internalName: "app_background",
        key: "action"
      }, {
        name: "app_foreground",
        internalName: "app_foreground",
        key: "action"
      }], n = 0, a = e.length; a > n; n++) (function (e) {
        var n = e.name, a = e.internalName;
        _["set_" + n] = function (n) {
          e.key ? y[e.key] = a : y[a] = n
        }
      })(e[n])
    }

    function l(e) {
      document.getElementsByTagName("body")[0] ? u(e) : document.addEventListener && document.addEventListener("DOMContentLoaded", function () {
        u(e)
      }, !1)
    }

    function u(e) {
      if (e && e.data) {
        var a = e.data;
        if ("created" === a.stream_status || "inactive" === a.stream_status || "unknown_device" === a.stream_status) {
          var t = window.screen;
          y.width = t.width, y.height = t.height, y.dpi_x = Math.round(s("width")), y.dpi_y = Math.round(s("height")), !y.tracking_id && a.tracking_id && (y.tracking_id = a.tracking_id);
          var r = Math.floor(1e5 * Math.random()), o = "cre_callback_" + r;
          y._c = o;
          var d = m();
          createCallJsonPScriptElement(v + d, o), window[o] = function () {
            n(o, r)
          }
        }
      }
    }

    function s(e) {
      var n = document.createElement("div");
      n.style[e] = "1in";
      var a = document.getElementsByTagName("body")[0];
      a.appendChild(n);
      var t = document.defaultView.getComputedStyle(n, null).getPropertyValue(e);
      return a.removeChild(n), parseFloat(t)
    }

    var _ = this, p = window.cre.trackingApiUrl,
      v = window.cre.deviceUrl, g = "100", f = "false", h = "true" == f, N = [];
    this.debug = -1 !== document.cookie.indexOf("cre_debug=1");
    var y = {};
    c(), this.request = function () {
      if (!d() && e()) {
        y._u = window.location.href, y._r = document.referrer;
        var a = Math.floor(1e5 * Math.random()), t = "cre_callback_" + a;
        window[t] = function (e) {
          r(e), n(t, a), l(e)
        }, y._c = t, y._kid = o("kid"), y._wid = o("wid"), window.oldbrowser === !0 && (y.oldbrowser = "true");
        var c = m();
        return createCallJsonPScriptElement(p + c, a), !0
      }
    }, this.addListener = function (e) {
      N.push(e)
    }, this.addFallback = function (callback) {
      fallbacks.push(callback)
    }, this.getParams = function () {
      return window.location.search
    }
  };
  return new e
}();
})();
