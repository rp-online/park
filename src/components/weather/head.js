(() => {
  const isClickDummy = (
    window.park.exports &&
    window.park.exports.config &&
    window.park.exports.config.isClickDummy
  );

  window.park = Object.assign({}, window.park, {
    weather: {
      isLoggedIn() {
        return isClickDummy
          ? window.park.storage.get('park.user.authenticated') === 'true'
          : !!window.park.cookie.get('sso_user');
      },
    },
  });
})();
