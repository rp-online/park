(() => {
  window.park.app({
    container: 'offer',
    component: 'offer',
  }).then((app) => {
    app.bindEvent('park.widget:rendered', () => {
      if (window.park.storage.get('park.offer.withoutOffers')) {
        window.park.storage.remove('park.offer.withoutOffers');
        return;
      }
      document.documentElement.classList.add('with-offers');
    });
  });
})();

