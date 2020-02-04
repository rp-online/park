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
      type: 'redirect-infobox',
    }, firstSection);

    window.park.eventHub.register('submit', '.park-redirect-infobox .park-searchform__form', (e) => {
      e.target.action = window.park.exports.config.searchPage;
    });

    window.park.eventHub.register('click', '.park-redirect-infobox__close', (e) => {
      const infobox = e.target.closest('.park-redirect-infobox');

      infobox.classList.add('park-redirect-infobox--is-closed');
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

    case '#redirect' :
      init();
      break;
  }
})();
