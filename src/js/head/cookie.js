(() => {
  window.park = Object.assign({}, window.park, {
    cookie: {
      get: (key) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${key}=`);
        if (parts.length === 2) {
          return parts.pop().split(';').shift();
        }
        return null;
      },
      set: (key, value, expires = 31536000) => {
        let domain = window.location.hostname;
        const domainParts = domain.split('.');

        if (domainParts.length > 2) {
          domain = domainParts.slice(-2).join('.');
        }

        // TODO: Use expires since max-age is not supported in IEs.
        document.cookie = `${key}=${value};path=/;domain=${domain};max-age=${expires}`;
      },
    },
  });
})();
