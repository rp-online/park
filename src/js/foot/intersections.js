(() => {
  window.park = Object.assign({}, window.park, {
    intersections: {
      observe: (elem, root, callback) => {
        if (!window.IntersectionObserver) {
          return false;
        }

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio > 0.001) {
              callback(true);
            } else {
              callback(false);
            }
          });
        }, {
          root,
          threshold: 0.001,
        });

        observer.observe(elem);

        return true;
      },
    },
  });
})();
