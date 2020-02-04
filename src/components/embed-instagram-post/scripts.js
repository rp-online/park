(() => {
  function init() {
    const elems = window.park.$('.park-embed-instagram-post');

    if (!elems.length) {
      return;
    }

    elems.forEach((elem) => {
      const link = elem.querySelector('a');
      const url = `https://api.instagram.com/oembed/?url=${link.getAttribute('href')}`;

      window.park.ajax(url, {
        jsonp: true,
      })
        .then(result => result.response())
        .then((result) => {
          elem.innerHTML = result.html;
          window.park.resourceLoader.script('https://platform.instagram.com/en_US/embeds.js');
        }).catch(console.warn.bind(console));
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  if (document.readyState !== 'loading') {
    init();
  }
})();
