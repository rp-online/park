(() => {
  let callbackCount = 0;

  function getFormData(elem) {
    if (!window.FormData) {
      window.park.console.error('Your browser does not support the FormData API');
      return false;
    }
    return new FormData(elem);
  }

  function process(xhr) {
    return {
      text: () => Promise.resolve(xhr.responseText),
      json: () => Promise.resolve(xhr.responseText).then(JSON.parse),
      xml: () => Promise.resolve(xhr.responseXML),
      response: () => Promise.resolve(xhr.response), // blob
      status: xhr.status,
      request: xhr,
    };
  }

  function jsonp(url, options) {
    return new Promise((resolve) => {
      const id = `park_jsonp_cb_${callbackCount}`;
      const head = document.querySelector('head');
      const script = document.createElement('script');
      const callbackParamName = typeof options.jsonp === 'string' ? options.jsonp : 'callback';

      script.src = `${url + (url.indexOf('?') === -1 ? '?' : '&')}${callbackParamName}=${id}`;
      head.appendChild(script);

      window[id] = (data) => {
        head.removeChild(script);
        resolve(process({
          response: data,
          responseText: data,
          status: 200,
          jsonpCallbackName: id,
        }));
        delete window[id];
      };

      callbackCount += 1;
    });
  }

  function xhr(url, options) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(options.method, url);

      if (options.headers && typeof options.headers === 'object') {
        Object.keys(options.headers).forEach((header) => {
          xhr.setRequestHeader(header, options.headers[header]);
        });
      }

      xhr.withCredentials = options.credentials === 'include'; // cors

      xhr.onload = () => {
        resolve(process(xhr));
      };

      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (options.form && options.form.nodeName === 'FORM') {
        options.body = getFormData(options.form);
      }

      xhr.send(options.body);
    });
  }

  window.park = Object.assign({}, window.park, {
    getFormData,
    ajax(url, requestOptions = {}) {
      if (typeof window.URL === 'function') {
        try {
          const parsedUrl = new URL(url, window.location);

          if (parsedUrl.protocol === 'file:') {
            return Promise.reject('Ajax requests are not supported with local files');
          }
        } catch (e) {
          return Promise.reject('Invalid URL given');
        }
      }

      const defaultOptions = {
        method: 'get',
        body: null,
        callback: () => {
        },
        jsonp: false,
        addNoCache: false,
      };

      const options = Object.assign({}, defaultOptions, requestOptions);

      if (options.addNoCache) {
        url = `${`${url + (url.indexOf('?') === -1 ? '?' : '&')}nocache=${(new Date()).getTime()}`}`;
      }

      if (options.jsonp) {
        return jsonp(url, options);
      }

      return xhr(url, options);
    },
  });
})();
