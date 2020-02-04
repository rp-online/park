(() => {
  function parse(elem) {
    if (!window.FB) {
      window.setTimeout(() => {
        parse(elem);
      }, 1000);
      return;
    }

    window.FB.XFBML.parse(elem);
  }

  function init() {
    const elems = window.park.$('.fb-post');

    if (!elems.length) {
      return;
    }

    window.park.resourceLoader.script('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5');
  }

  document.addEventListener('DOMContentLoaded', init);

  if (document.readyState !== 'loading') {
    init();
  }

  window.park.observer.initialize('.fb-post', (elem) => {
    window.park.resourceLoader.script('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5', () => {
      parse(elem);
    });
  });
})();
