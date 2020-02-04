(() => {
  window.park.observer.initialize('div.park-image__image--lazy', (elem) => {
    window.park.lazyLoad(elem);
  }, false);
})();
