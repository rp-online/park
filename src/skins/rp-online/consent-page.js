(() => {
  if (window.location.hostname.indexOf('gera-interred') > -1 ||
    window.location.hostname.indexOf('vorschau-www') > -1) {
    return;
  }

  // eslint-disable-next-line
  const brwoserStorage = window.localStorage;
  function getCookie(o) {
    const t = (`; ${document.cookie}`).split(`; ${o}=`);
    let result;
    if (t.length === 2) {
      result = t.pop().split(';').shift();
    }
    return result;
  }

  function deleteCookie(name) {
    const path = '/';
    const domain = 'rp-online.de';
    if (getCookie(name)) {
      document.cookie = `${name}=${
        (path) ? `;path=${path}` : ''
      }${(domain) ? `;domain=${domain}` : ''
      };expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    }
  }

  function redirectUser() {
    if (window.dataLayer[0].adFreeReasons.PaidUser === 0) {
      deleteCookie('eupubconsent-v2');
      deleteCookie('OptanonConsent');
      deleteCookie('cPage');
    }
    brwoserStorage.setItem('park.consent.referrer', `${window.location.href}`);
    // eslint-disable-next-line
    brwoserStorage.setItem('park.consent.title', `${consentTitle}`);
    // eslint-disable-next-line
    brwoserStorage.setItem('park.consent.initialReferrer', document.referrer);
    // eslint-disable-next-line
    window.location.href = consentUrl;
  }

  const allowAll = function () {
    if (typeof window.Optanon === 'object' && typeof window.Optanon.AllowAll === 'function') {
      window.Optanon.AllowAll();
    } else {
      window.setTimeout(allowAll, 50);
    }
  };

  const init = function () {
    if (window.location.href.indexOf('/sso') > -1) {
      return;
    }

    const configuredGroups = window.park.exports.config.consentCookieCategoryId.split(',');
    let splitedGroups = [];

    if (!(getCookie('cPage')) && (window.dataLayer[0].adFreeReasons.PaidUser !== 1)) {
      redirectUser();
    }
    const activeGroups = getCookie('OptanonConsent').split('&');
    if (activeGroups.length > 0) {
      // eslint-disable-next-line
      for (const cookieEntry in activeGroups) {
        if (activeGroups[cookieEntry].indexOf('groups') > -1) {
          activeGroups[cookieEntry] = activeGroups[cookieEntry].replace('groups=', '');
          activeGroups[cookieEntry] = activeGroups[cookieEntry].replace(/%2C/g, '');
          splitedGroups = activeGroups[cookieEntry].split('%3A1');
        }
      }

      // eslint-disable-next-line
      for (const groupId in configuredGroups) {
        if (!splitedGroups.includes(configuredGroups[groupId])) {
          if (window.dataLayer[0].adFreeReasons.PaidUser === 1) {
            allowAll();
          } else {
            redirectUser();
          }
        }
      }
    }

    if ((typeof __tcfapi === 'function' && document.cookie.indexOf('eupubconsent-v2') >= 0) && (window.dataLayer[0].adFreeReasons.PaidUser !== 1)) {
      // eslint-disable-next-line
      __tcfapi('getTCData', 2, (tcData, success) => {
        let consentSize = 0;
        if (success && tcData.cmpStatus === 'loaded') {
          // eslint-disable-next-line
          for (const purposeConsent in tcData.purpose.consents) {
            if (tcData.purpose.consents[purposeConsent] === false) {
              redirectUser();
            } else if (tcData.purpose.consents[purposeConsent] === true) {
              consentSize += 1;
            }
          }
          if (consentSize !== 10) {
            redirectUser();
          }
          if (window.dataLayer[0].adFreeReasons.PaidUser === 0) {
            window.park.headerBidder.loadAndInit();
          }
        } else {
          window.setTimeout(init, 50);
        }
      });
    } else {
      window.setTimeout(init, 50);
    }
  };

  const botPattern = '(bot|crawler|spider|crawling|bing|bingbot|google|msnbot|aol|DuckDuckBot|yahoo|ecosia|teoma|rpd)';
  const re = new RegExp(botPattern, 'i');
  const userAgent = navigator.userAgent.toLowerCase();
  console.log('webdriver test', window.navigator.webdriver);
  if (!re.test(userAgent) || !window.navigator.webdriver) {
    if ((getCookie('sso') &&
      getCookie('sso-sid') &&
      getCookie('sso_user') &&
      !getCookie('eupubconsent-v2') &&
      !getCookie('OptanonConsent') &&
      brwoserStorage.getItem('park.user.npa') === '1') ||
      (brwoserStorage.getItem('park.user.authenticated') === 'true' && window.dataLayer[0].adFreeReasons.PaidUser === 1)) {
      allowAll();
    } else if ((!getCookie('eupubconsent-v2') || !getCookie('OptanonConsent')) && (window.dataLayer[0].adFreeReasons.PaidUser === 0)) {
      redirectUser();
    }
    init();
  }
})();
