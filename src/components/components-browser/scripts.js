(() => {
  function toggle() {
    const elems = window.park.$('.park-components-browser__component');

    if (!elems.length) {
      return;
    }

    elems.forEach((elem) => {
      elem.classList.remove('park-components-browser__component--is-current');
    });

    if (!window.location.hash) {
      return;
    }

    const link = document.querySelector(`a[href="${window.location.hash}"]`);
    const target = document.querySelector(window.location.hash);

    link.focus();
    target.classList.add('park-components-browser__component--is-current');
  }

  window.park.eventHub.register('click', '.park-components-browser__navigation a[href^="#"]', (e) => {
    const hash = e.target.getAttribute('href');

    if (hash === window.location.hash) {
      if (window.history) {
        window.history.replaceState('', document.title, window.location.pathname);
        toggle();
      } else {
        window.location.hash = '#index';
      }

      e.preventDefault();
      document.querySelector('.park-components-browser__intro').focus();
      return;
    }

    window.location.hash = hash;
    e.preventDefault();
    e.target.focus();
  });

  window.addEventListener('hashchange', toggle);

  toggle();

  window.park.eventHub.register('click', '.park-components-browser__content a[href^="#"]', (e) => {
    e.stopImmediatePropagation();
  });

  window.addEventListener('DOMContentLoaded', () => {
    const navigation = document.querySelector('.park-components-browser .park-navigation');

    if (navigation) {
      navigation.removeAttribute('aria-hidden');
    }
  });
})();
