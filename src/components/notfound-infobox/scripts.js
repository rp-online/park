(() => {
  function init() {
    const main = document.querySelector('main');

    if (!main) {
      window.setTimeout(init, 100);
      return;
    }

    const firstSection = main.querySelector('.park-section');

    if (!firstSection) {
      window.setTimeout(init, 100);
      return;
    }

    window.park.widgets.prepend({
      type: 'notfound-infobox',
    }, firstSection);

    window.park.eventHub.register('submit', '.park-notfound-infobox .park-searchform__form', (e) => {
      e.target.action = window.park.exports.config.searchPage;
    });

    window.park.eventHub.register('click', '.park-notfound-infobox__close', (e) => {
      const infobox = e.target.closest('.park-notfound-infobox');

      infobox.classList.add('park-notfound-infobox--is-closed');
    });
  }

  if (
    !window.park ||
    !window.park.exports ||
    !window.park.exports.config ||
    !window.park.exports.config.searchPage
  ) {
    return;
  }

  switch (window.location.hash) {
    default:
      break;

    case '#notfound':
    case '#articleNotFound' :
      init();
      break;
  }
})();
