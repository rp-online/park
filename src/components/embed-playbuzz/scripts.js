(() => {
  function trackPageview(e) {
    window.park.console.log('Tracking PlayBuzz Page View!');

    const itemId = e.articleId;
    const elem = document.querySelector(`[data-item="${itemId}"]`);

    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.embed-playbuzz:pageview', {
        elem,
      });
    }
  }

  window.PlayBuzzCallback = (e) => {
    switch (e.eventName) {
      default:
        break;

      case 'item_result':
      case 'particle_result':
        trackPageview(e);
        break;
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.setTimeout(() => {
      const elems = window.park.$('.park-embed-playbuzz');

      if (!elems.length) {
        return;
      }

      elems.forEach((elem) => {
        elem.innerHTML = elem.querySelector('.park-embed-playbuzz__code').textContent;
      });

      window.park.resourceLoader.script('https://cdn.playbuzz.com/widget/feed.js');
    });
  });
})();
