(() => {
  if (document.documentElement.classList.contains('is-app')) {
    // In the App (phones only, not tablets) we have a fixed viewport without scrolling
    return;
  }

  let justResized = false;

  window.park.eventHub.register('orientationchange', window, () => {
    if (justResized) {
      return;
    }

    justResized = true;
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1');
    window.setTimeout(() => {
      if (window.matchMedia && matchMedia('screen and (min-width: 45.3125em)').matches) {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=1280, user-scalable=no');

        window.setTimeout(() => {
          document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=1280');
          window.setTimeout(() => {
            justResized = false;
          }, 100);
        }, 1000);
      }
    });
  });
})();
