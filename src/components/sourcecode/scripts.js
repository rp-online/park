(() => {
  function highlightElement(elem, code) {
    if (!window.Prism) {
      window.setTimeout(() => {
        highlightElement(elem, code);
      }, 100);
      return;
    }

    window.Prism.highlightElement(code);
    elem.classList.add('park-sourcecode--is-initialized');
  }

  window.park.observer.initialize('.park-sourcecode', (elem) => {
    const code = elem.querySelector('code');
    const language = code.className.trim().replace(/^.*language-([a-z]+).*$/, '$1').trim();

    window.park.resourceLoader.stylesheet(`${window.park.exports.config.assetsBase}/prism/prism.css?v=${window.park.exports.config.version}`);
    window.park.resourceLoader.script(`${window.park.exports.config.assetsBase}/prism/prism.js?v=${window.park.exports.config.version}`, () => {
      window.park.resourceLoader.script(`${window.park.exports.config.assetsBase}/prism/components.js?v=${window.park.exports.config.version}`, () => {
        window.park.resourceLoader.script(`${window.park.exports.config.assetsBase}/prism/components/prism-${language}.js?v=${window.park.exports.config.version}`, () => {
          highlightElement(elem, code);
        });
      });
    }, {
      'data-manual': '',
    });
  });
})();
