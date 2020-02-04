(() => {
  function reducer(state, action) {
    switch (action.type) {
      case 'UPDATEBOOKMARKS':
        state.bookmarks =
          state.bookmarks.filter(item => action.value.indexOf(item.id) > -1);
        break;

      default:
        break;
    }
    return state;
  }

  window.park.app({
    container: 'bookmarks',
    component: 'section',
    reducer,
  }).then((app) => {
    document.addEventListener('park.user:bookmarkschange', () => {
      window.park.user.getPreferences()
        .then((preferences) => {
          const bookmarks = (
            preferences &&
            preferences.bookmarks &&
            preferences.bookmarks.forEach
          ) || [];

          app.store.dispatch({
            type: 'UPDATEBOOKMARKS',
            value: bookmarks,
          });
        });
    });
  });
})();
