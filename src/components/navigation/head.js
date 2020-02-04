(() => {
  window.park.observer.initialize('div.park-navigation__panel', (elem) => {
    window.park.lazyLoad(elem);
  }, false);
})();
