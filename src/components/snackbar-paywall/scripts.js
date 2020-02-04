(() => {
  const isClickDummy = (
    window.park.exports &&
    window.park.exports.config &&
    window.park.exports.config.isClickDummy
  );

  if (isClickDummy && Math.random() < 0.25) {
    window.park.snackbarManager.open('paywall');
  }
})();
