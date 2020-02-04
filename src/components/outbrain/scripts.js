(() => {
  function init() {
    const elems = window.park.$('.park-outbrain');

    if (!elems.length) {
      return;
    }

    window.park.resourceLoader.script('https://widgets.outbrain.com/outbrain.js');
  }

  document.addEventListener('DOMContentLoaded', init);

  if (document.readyState !== 'loading') {
    init();
  }
})();
