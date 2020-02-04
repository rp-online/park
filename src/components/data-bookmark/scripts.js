(() => {
  window.park.eventHub.register('click park:toggle-on', '[data-bookmark]', (e) => {
    if (!window.park.user.isLoggedIn()) {
      return;
    }

    const addBookmarkAction = 'Diesen Beitrag zur Merkliste hinzufügen';
    const deleteBookmarkAction = 'Diesen Beitrag von der Merkliste entfernen';
    const elem = e.target.closest('[data-bookmark]');
    const itemId = elem.getAttribute('data-bookmark');
    const isBookmarked = elem.matches('.is-bookmarked');

    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.data-bookmark:toggled', {
        elem,
        itemId,
        isBookmarked,
      });
    }

    window.park.user.setItemBookmarkState(itemId, !isBookmarked).then(() => {
      if (isBookmarked && e.type !== 'park:toggle-on') {
        elem.setAttribute('title', deleteBookmarkAction);
        elem.classList.remove('is-bookmarked');
        window.park.notifications.create({
          id: 'bookmark-remove-success',
          data: {
            headline: 'Der Beitrag wurde von Ihrer Merkliste entfernt.',
            type: 'success',
          },
        });
      } else {
        elem.setAttribute('title', addBookmarkAction);
        elem.classList.add('is-bookmarked');
        window.park.notifications.create({
          id: 'bookmark-add-success',
          data: {
            headline: 'Der Beitrag wurde Ihrer Merkliste hinzugefügt.',
            body: window.park.exports.config.bookmarksPage ? `<a href="${window.park.exports.config.bookmarksPage}">Merkliste anzeigen</a>` : '',
            type: 'success',
          },
        });
      }
    });

    elem.classList.add('was-just-toggled');
    window.setTimeout(() => {
      elem.classList.remove('was-just-toggled');
    }, 1300);
  });

  window.park.observer.initialize('[data-bookmark]', (elem) => {
    const addBookmarkAction = 'Diesen Beitrag zur Merkliste hinzufügen';
    const deleteBookmarkAction = 'Diesen Beitrag von der Merkliste entfernen';

    function update(elem) {
      const itemId = elem.getAttribute('data-bookmark');

      window.park.user.getItemBookmarkedState(itemId)
        .then((isBookmarked) => {
          if (isBookmarked) {
            elem.classList.add('is-bookmarked');
            elem.setAttribute('title', deleteBookmarkAction);
          } else {
            elem.classList.remove('is-bookmarked');
            elem.setAttribute('title', addBookmarkAction);
          }
        })
        .catch(() => {
          elem.classList.remove('is-bookmarked');
          elem.setAttribute('title', addBookmarkAction);
        });
    }

    document.addEventListener('park.user:authchange', () => {
      update(elem);
    });

    update(elem);
  }, false);
})();
