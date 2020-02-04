(() => {
  function callback(entries) {
    entries.forEach((entry) => {
      entry.target.classList[entry.intersectionRatio > 0 ? 'add' : 'remove']('park-button-bookmark--in-view');
    });
  }

  const viewportHeight = window.innerHeight;
  const heightFragment = Math.round(viewportHeight * 0.25);
  const observer = window.IntersectionObserver ? new IntersectionObserver(callback, {
    root: null,
    rootMargin: `-${heightFragment}px 0px -${heightFragment}px 0px`,
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  }) : {
    observe: () => {},
  };

  window.park.observer.initialize('.park-button-bookmark', (elem) => {
    observer.observe(elem);
  }, false);
})();
