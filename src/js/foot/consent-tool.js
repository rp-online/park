(() => {
  window.park.observer.initialize('#onetrust-consent-sdk', (elem) => {
    document.querySelector('body').appendChild(elem);
  }, false);
})();
