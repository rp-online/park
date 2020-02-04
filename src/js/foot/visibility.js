(() => {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') {
      return;
    }

    if (!window.park.eventHub || !window.park.console) {
      return;
    }

    window.park.eventHub.trigger(document, 'park.visibility:visible', {
      elem: document,
    });

    window.park.console.log('Visibility returned to page');
  });
})();
