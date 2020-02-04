(() => {
  if (
    !window.park ||
    !window.park.exports ||
    !window.park.exports.config ||
    !window.park.exports.config.keys ||
    !window.park.exports.config.keys.googleMaps
  ) {
    return;
  }

  let initialized = false;

  function parse(elem) {
    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.Map
    ) {
      return;
    }

    const lat = parseFloat(elem.getAttribute('data-lat'));
    const lng = parseFloat(elem.getAttribute('data-lng'));
    const zoom = parseInt(elem.getAttribute('data-zoom'), 10);

    const map = new window.google.maps.Map(elem.querySelector('.park-embed-map__map'), {
      zoom,
      center: {
        lat,
        lng,
      },
      gestureHandling: 'cooperative',
    });

    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.TrafficLayer
    ) {
      return;
    }

    if (elem.hasAttribute('data-traffic')) {
      const trafficLayer = new window.google.maps.TrafficLayer();

      trafficLayer.setMap(map);
    }
  }

  function init() {
    window.park.$('.park-embed-map').forEach(parse);
    initialized = true;
  }

  window.park.observer.initialize('.park-embed-map', (elem) => {
    if (initialized) {
      parse(elem);
      return;
    }

    window.park.resourceLoader.script(`https://maps.googleapis.com/maps/api/js?&key=${window.park.exports.config.keys.googleMaps}&callback=parkEmbedMap`);
  });

  window.parkEmbedMap = init;
})();
