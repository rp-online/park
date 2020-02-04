(() => {
  function triggerEvent(elem) {
    if (!window.park.eventHub) {
      window.setTimeout(() => {
        triggerEvent(elem);
      }, 200);
      return;
    }

    window.park.eventHub.trigger(elem, 'park.countdown:done');
  }

  function countdown(elem, seconds) {
    if (seconds === 0) {
      triggerEvent(elem);
      return;
    }
    window.setTimeout(() => {
      seconds -= 1;
      elem.textContent = seconds;
      countdown(elem, seconds);
    }, 1000);
  }

  window.park.observer.initialize('.park-countdown', (elem) => {
    const seconds = parseInt(elem.textContent, 10);
    countdown(elem, seconds - 1);

    const redirect = elem.getAttribute('data-redirect');
    if (redirect) {
      window.park.eventHub.register('park.countdown:done', '.park-countdown', () => {
        window.location = redirect;
      });
    }
  }, false);
})();
