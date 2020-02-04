(() => {
  function parse(elem) {
    if (window.twttr && window.twttr.widgets && window.twttr.widgets.load) {
      window.twttr.widgets.load(elem);
    } else {
      window.setTimeout(() => {
        parse(elem);
      }, 200);
    }
  }

  function init(elem) {
    if (elem.matches('.park-embed-twitter-tweet')) {
      const link = elem.querySelector('a');
      const url = `https://publish.twitter.com/oembed?url=${link.getAttribute('href')}`;

      window.park.ajax(url, {
        jsonp: true,
      })
        .then(result => result.response())
        .then((result) => {
          console.log(result);
          elem.innerHTML = result.html;
          parse(elem);
        }).catch(console.warn.bind(console));
    } else {
      parse(elem);
    }
  }

  window.park.observer.initialize('.park-embed-twitter-tweet, blockquote.twitter-tweet', (elem) => {
    window.park.resourceLoader.script('https://platform.twitter.com/widgets.js');
    init(elem);
  }, false);
})();
