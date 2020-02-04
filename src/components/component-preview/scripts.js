(() => {
  function updateAuthenticateButton(elem) {
    const toggleAuthButton = elem.querySelector('[data-authenticate]');

    if (window.park.user.isLoggedIn()) {
      toggleAuthButton.innerHTML = `${toggleAuthButton.innerHTML.replace('login', '').replace('logout', '')}logout`;
    } else {
      toggleAuthButton.innerHTML = `${toggleAuthButton.innerHTML.replace('login', '').replace('logout', '')}login`;
    }
  }

  function updateResponsifyButton(elem) {
    const parent = elem.closest('.park-component-preview');

    if (parent.classList.contains('park-component-preview--simulate-mobile')) {
      elem.innerHTML = elem.innerHTML.replace('mobile aus', 'mobile an');
    } else {
      elem.innerHTML = elem.innerHTML.replace('mobile an', 'mobile aus');
    }

    parent.classList.toggle('park-component-preview--simulate-mobile');
  }

  window.park.eventHub.register('click', '.park-component-preview [data-responsify]', (e) => {
    updateResponsifyButton(e.target);
  });

  window.park.eventHub.register('click', '.park-component-preview [data-authenticate]', () => {
    if (window.park.user.isLoggedIn()) {
      window.park.user.logout();
    } else {
      window.park.user.login();
    }
  });

  window.park.observer.initialize('.park-component-preview', (elem) => {
    document.addEventListener('park.user:authchange', () => {
      updateAuthenticateButton(elem);
    });

    updateAuthenticateButton(elem);
  });
})();
