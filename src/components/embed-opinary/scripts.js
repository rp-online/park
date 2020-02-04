(() => {
  const viewedElems = window.WeakSet ? new WeakSet() : new Set();

  function trackPageview(e) {
    const pollId = e.pollId;
    const elem = document.querySelector(`[data-poll="${pollId}"]`);

    console.log('Tracking Opinary Page View!');

    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.embed-opinary:pageview', {
        elem,
      });
    }
  }

  window.addEventListener('OpinaryReady', () => {
    console.log('OpinaryReady');

    window.Opinary.on('opinary.impression', (e) => {
      const pollId = e.pollId;
      const elem = document.querySelector(`[data-poll="${pollId}"]`);

      if (!viewedElems.has(elem)) {
        console.log('Registered an Opinary Initial View!');
        viewedElems.add(elem);
        return;
      }

      console.log('Registered an Opinary Repeated View!');

      trackPageview(e);
    });
    window.Opinary.on('opinary.vote', (e) => {
      console.log('Registered an Opinary Vote!');

      trackPageview(e);
    });
  });

  window.park.observer.initialize('.opinary-widget-embed', () => {
    window.setTimeout(() => {
      window.park.resourceLoader.script('https://widgets.opinary.com/embed.js');
    });
  });
})();
