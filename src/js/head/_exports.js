(() => {
  const root = document.documentElement;
  const htmlConfig = root.getAttribute('data-config') || '{}';
  const htmlPseudoData = window.getComputedStyle(root, ':before')
    .getPropertyValue('content');

  const fallbackData = {
    mediaqueries: {
      desktop: 'screen and (min-width: 48.0625em)',
    },
  };

  if (!htmlPseudoData) {
    window.console.warn('Seems like the inlined critical CSS is missing.');
  }

  // Read out the value JSON-encoded into body::before via SASS
  window.park = Object.assign({}, window.park, {
    exports: htmlPseudoData ? JSON.parse(
      htmlPseudoData
        .replace(/\\"/g, '"')
        .replace(/(^"|"$)/g, '')
        .replace(/'/g, ' ')) : fallbackData,
  });

  window.park.exports.config = JSON.parse(htmlConfig);
  window.park.exports.config.appMode = window.park.exports.config.isApp;
})();
