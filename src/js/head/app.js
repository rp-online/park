(() => {
  const bootstrapFunction = params => new Promise((resolve) => {
    function init() {
      if (!window.park.app || window.park.app === bootstrapFunction) {
        window.setTimeout(() => {
          init();
        }, 100);
        return;
      }
      window.park.app(params).then((result) => {
        resolve(result);
      });
    }

    init();
  });

  window.park = Object.assign({}, window.park, {
    app: bootstrapFunction,
  });
})();
