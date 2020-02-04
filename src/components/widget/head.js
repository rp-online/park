(() => {
  window.park.observer.initialize('.park-widget', (elem) => {
    const type = elem.getAttribute('data-type').trim();
    const widgetSrc = `${window.park.exports.config.rootBase}/assets/widgets/${type}.js?v=${window.park.exports.config.version}`;
    const formDataPolyfill = `${window.park.exports.config.rootBase}/assets/widgets/formdata-polyfill.js?v=${window.park.exports.config.version}`;

    if (!window.FormData || typeof FormData.prototype.entries === 'undefined') {
      window.park.resourceLoader.script(formDataPolyfill);
    }

    window.park.resourceLoader.script(widgetSrc);
  }, false);
})();
