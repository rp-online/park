(() => {
  if (!window.park.exports.config.loginOverlay || !window.park.exports.config.loginPage) {
    return;
  }

  const link = document.createElement('a');
  link.setAttribute('href', window.park.exports.config.loginPage);

  const loginUrl = link.href;

  let loginOverlayExists = false;

  function createLoginOverlayWidget(data) {
    const initialState = {
      type: 'login-overlay',
      initialState: data,
    };

    const widget = window.park.widgets.create(initialState);
    document.querySelector('body').appendChild(widget);
  }

  function createLoginOverlay() {
    loginOverlayExists = true;
    createLoginOverlayWidget({
      id: 'login',
      children: [
        {
          component: 'iframe',
          data: {
            src: window.park.exports.config.loginPage,
            width: 800,
            height: 600,
            title: 'Login IFrame',
            name: 'login',
          },
        },
      ],
      startOpened: true,
    });
  }

  window.park.eventHub.register('click', 'a', (e) => {
    const link = e.target.closest('a');

    if (!link.href.startsWith(loginUrl)) {
      return;
    }

    if (window.park.user.isLoggedIn()) {
      window.location.href = '/sso/settings';
      e.preventDefault();
      return;
    }

    if (!loginOverlayExists) {
      createLoginOverlay();
    } else {
      window.park.overlayManager.open('login');
    }

    e.preventDefault();
  });

  document.addEventListener('park.user:authchange', () => {
    if (loginOverlayExists && window.park.user.isLoggedIn()) {
      window.park.overlayManager.close('login');

      window.park.ajax(window.location.href)
        .then(result => result.text())
        .then((result) => {
          if (document.documentElement.classList.contains('is-ad-free') !== (result.indexOf('is-ad-free') > -1)) {
            window.location.reload();
          }
        });
    }
  });
})();
