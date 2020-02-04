(() => {
  const head = document.querySelector('head');
  const loadingResources = [];
  const loadedResources = [];
  const preloadedResources = [];

  window.park = Object.assign({}, window.park, {
    resourceLoader: {
      script(url, callback, extraAttributes) {
        return new Promise((resolve, reject) => {
          if (loadedResources.indexOf(url) > -1) {
            if (callback) {
              callback();
            }
            return;
          }

          if (loadingResources.indexOf(url) > -1) {
            window.setTimeout(() => {
              window.park.resourceLoader.script(url, callback, extraAttributes);
            }, 100);
            return;
          }

          const script = document.createElement('script');

          script.onload = () => {
            loadedResources.push(url);
            if (callback) {
              callback();
            }
            resolve();
          };

          script.onerror = () => {
            reject();
          };

          if (extraAttributes) {
            Object.keys(extraAttributes).forEach((key) => {
              script.setAttribute(key, extraAttributes[key]);
            });
          }

          script.async = true;
          script.src = url;

          head.appendChild(script);
          loadingResources.push(url);
        });
      },
      stylesheet(url, extraAttributes) {
        if (loadedResources.indexOf(url) > -1) {
          return;
        }

        const stylesheet = document.createElement('link');

        if (extraAttributes) {
          Object.keys(extraAttributes).forEach((key) => {
            stylesheet.setAttribute(key, extraAttributes.key);
          });
        }

        stylesheet.rel = 'stylesheet';
        stylesheet.href = url;

        head.appendChild(stylesheet);
        loadedResources.push(url);
      },
      preload(url, asType) {
        if (preloadedResources.indexOf(url) > -1) {
          return;
        }

        const link = document.createElement('link');

        link.setAttribute('rel', 'preload');
        link.setAttribute('as', asType);
        link.setAttribute('href', url);

        head.appendChild(link);
        preloadedResources.push(url);
      },
    },
  });
})();
