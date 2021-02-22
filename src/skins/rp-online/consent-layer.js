(() => {
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

  if (getCookie('cPage')) {
    deleteCookie('cPage');
  }
})();
