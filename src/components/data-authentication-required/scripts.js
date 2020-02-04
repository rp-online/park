(() => {
  function executePostponedAction() {
    if (!window.park.user.isLoggedIn()) {
      return;
    }

    // If the user has just logged in we try to execute a previous action once more
    if (window.location.hash !== '#successLogin') {
      return;
    }

    const actionToExecuteAfterLogin = window.park.storage.get('park-action-to-execute-after-login');
    window.park.storage.remove('park-action-to-execute-after-login');

    if (!actionToExecuteAfterLogin) {
      return;
    }

    if (actionToExecuteAfterLogin.where !== window.location.pathname) {
      return;
    }

    const domparser = new DOMParser();
    const deserializedDocument = domparser.parseFromString(actionToExecuteAfterLogin.clickedElementSerialized, 'text/xml');
    const elem = document.querySelector('body').appendChild(deserializedDocument.firstChild);

    elem.style.display = 'none';

    window.setTimeout(() => {
      window.park.eventHub.trigger(elem, 'park:toggle-on');
    }, elem.closest('a') ? 0 : 2000);
  }

  function update(elem) {
    if (window.park.user.isLoggedIn()) {
      elem.removeAttribute('data-popover');
    } else {
      elem.setAttribute('data-popover', JSON.stringify({
        position: 'left-start',
        backgroundColor: 'white',
        openEvents: 'click',
        closeEvents: '',
        showCloseButton: true,
        component: 'cta-login',
      }));
    }
  }

  window.park.eventHub.register('park:toggle-on', '[data-authentication-required]', (e) => {
    const elem = e.target;
    const link = elem.closest('a');

    if (link) {
      window.location = link.href;
    }
  });

  window.park.eventHub.register('click', '[data-authentication-required]', (e) => {
    const elem = e.target.closest('[data-authentication-required]');
    const xmlSerializer = new XMLSerializer();

    if (window.park.user.isLoggedIn()) {
      return;
    }

    const actionToExecuteAfterLogin = {
      where: window.location.pathname,
      clickedElementSerialized: xmlSerializer.serializeToString(elem),
    };

    window.park.storage.set('park-action-to-execute-after-login', actionToExecuteAfterLogin);

    elem.classList.add('park-data-authentication-required--error');
    window.setTimeout(() => {
      elem.classList.remove('park-data-authentication-required--error');
    }, 500);

    e.preventDefault();
  });

  window.park.observer.initialize('[data-authentication-required]', (elem) => {
    document.addEventListener('park.user:authchange', () => {
      update(elem);
    });

    update(elem);
  });

  executePostponedAction();

  window.addEventListener('hashchange', () => {
    executePostponedAction();
  });
})();
