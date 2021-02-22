(() => {
  window.park = Object.assign({}, window.park, {
    welect: {
      preflightCheck: (callback) => {
        // Simulating an async AJAX call to Welect's preflight check endpoint
        // Needs to be replaced by the real thing
        const productId = window.park.exports.config.adblocker.welectProductId;
        window.park.ajax(`${window.park.exports.config.adblocker.welectApiBaseUrl}/preflight/${productId}`)
        .then(result => result.json())
        .then((result) => {
          callback(result.available);
        });
      },
    },
  });
})();
