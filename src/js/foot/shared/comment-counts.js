(() => {
  const $ = window.park.$;
  let initialized = false;
  let text = '';

  window.park.observer.initialize('[data-comments-counturl]', (elem) => {
    if (initialized) {
      return;
    }

    initialized = true;

    if (!elem.getAttribute('data-comments-counturl')) {
      return;
    }

    const url = `${window.park.exports.config.rootBase}${elem.getAttribute('data-comments-counturl')}`;

    window.park.ajax(url)
      .then(result => result.json())
      .then((result) => {
        switch (parseInt(result.count, 10)) {
          default:
            text = `${result.count} Kommentare`;
            break;

          case 0:
            text = 'Keine Kommentare';
            break;

          case 1:
            text = 'Ein Kommentar';
            break;
        }

        $('[class$="__commentscount"]').forEach((elem) => {
          elem.setAttribute('data-comments-count', result.count);
          elem.textContent = text;
        });
      })
      .catch((e) => {
        window.park.console.log(e);
      });
  }, false);

  window.park.observer.initialize('[class$="__commentscount"]', (elem) => {
    elem.textContent = text;
  });
})();
