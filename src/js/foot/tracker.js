(() => {
  // The following block maps certain events into new trackable events
  function mapOverlays(e) {
    switch (e.detail.elem.id) {
      default:
        break;

      case 'park-overlay-enlargable':
      case 'park-user-menu__list':
      case 'park-overlay-authentication-required':
        if (window.park.eventHub) {
          window.park.eventHub.trigger(document, 'park.overlay:pageview', {
            elem: e.detail.elem,
          });
        }
        break;
    }
  }

  function mapComments(e) {
    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.comments:pageview', {
        elem: e.detail.elem,
      });
    }
  }

  document.addEventListener('park.overlay:open', mapOverlays);
  document.addEventListener('park.overlay:close', mapOverlays);
  document.addEventListener('park.comments:sort', mapComments);
  document.addEventListener('park.comments:more', mapComments);
  document.addEventListener('park.smooth-scroll:scroll', (e) => {
    switch (e.detail.elem.id) {
      default:
        break;

      case 'park-comments':
        if (window.park.eventHub) {
          window.park.eventHub.trigger(document, 'park.smooth-scroll:pageview', {
            elem: e.detail.elem,
          });
        }
        break;
    }
  });

  // The following block attaches trackings to certain events
  document.addEventListener('park.visibility:visible', () => {
    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.navigation:pageview', () => {
    // Not tracking IVW anymore here, due to IVW complaining
  });

  document.addEventListener('park.gallery:pageview', () => {
    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.article.gallery:pageview', () => {
    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.slider:slided', () => {
    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.data-bookmark:toggled', () => {
    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.tab-container:toggled', () => {
    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.comments:pageview', () => {
    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.smooth-scroll:pageview', () => {
    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.overlay:pageview', (e) => {
    if (e.detail && e.detail.elem && e.detail.elem.matches('.park-user-menu__list')) {
      // Not tracking IVW anymore here, due to IVW complaining
      return;
    }

    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.embed-tickaroo:pageview', () => {
    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.embed-playbuzz:pageview', () => {
    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.embed-opinary:pageview', () => {
    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.app:pageview', () => {
    window.park.console.log('Tracking a page view');
    window.park.ivw.trackPageView();
  });

  document.addEventListener('park.video:load', (e) => {
    const elem = e.detail.elem;

    if (elem.classList.contains('park-video--do-not-track')) {
      window.park.console.log('Interactions with this video should not be tracked');
      return;
    }

    window.park.console.log('Detected a video load');
  });

  document.addEventListener('park.video:play', (e) => {
    const elem = e.detail.elem;

    if (elem.classList.contains('park-video--do-not-track')) {
      window.park.console.log('Interactions with this video will not be tracked');
      return;
    }

    window.park.console.log('Tracking a video play');
    window.park.ivw.trackVideoPlay();
  });

  document.addEventListener('park.video:end', (e) => {
    const elem = e.detail.elem;

    if (elem.classList.contains('park-video--do-not-track')) {
      window.park.console.log('Interactions with this video should not be tracked');
      return;
    }

    window.park.console.log('Detected a video end');
  });

  document.addEventListener('park.search:displayresults', () => {
    window.park.console.log('Tracking a search result');
    window.park.ivw.trackSearchResult();
  });
})();
