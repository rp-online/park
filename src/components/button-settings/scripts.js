(() => {
  function update(elem) {
    const popoverConfig = {
      position: 'left-start',
      backgroundColor: 'white',
      openEvents: 'click',
      closeEvents: '',
      showCloseButton: true,
      component: 'cta-login',
    };

    if (!window.park.user.isLoggedIn()) {
      elem.setAttribute('data-popover', JSON.stringify(popoverConfig));
    } else {
      elem.removeAttribute('data-popover');
    }
  }

  window.park.eventHub.register('park:toggle-on', '.park-button-settings', (e) => {
    e.target.closest('.park-button-settings').click();
  });

  window.park.eventHub.register('click', '.park-button-settings', (e) => {
    if (!window.park.user.isLoggedIn()) {
      e.preventDefault();
    }
  });

  window.park.observer.initialize('.park-button-settings', (elem) => {
    document.addEventListener('park.user:authchange', () => {
      update(elem);
    });

    update(elem);
  });
})();
