(() => {
  window.park = Object.assign({}, window.park, {
    visibility: {
      isVisible(elem) {
        if (!elem || !elem.getBoundingClientRect) {
          return false;
        }

        const boundingRect = elem.getBoundingClientRect();
        const elemCenter = document.elementFromPoint(
          boundingRect.left + ((boundingRect.right - boundingRect.left) / 2),
          boundingRect.top + ((boundingRect.bottom - boundingRect.top) / 2)
        );

        return (
          elem.contains(elemCenter) &&
          boundingRect.top <= window.innerHeight &&
          boundingRect.right - boundingRect.left &&
          boundingRect.bottom - boundingRect.top &&
          boundingRect.top + boundingRect.height >= 0 &&
          boundingRect.left <= window.innerWidth &&
          boundingRect.left + boundingRect.width >= 0
        );
      },
    },
  });
})();
