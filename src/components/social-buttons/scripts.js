(() => {
  window.park.eventHub.register('click', '.park-social-buttons .park-button[href]', (e) => {
    const pageTitle = document.title;
    const pageHash = window.location.hash;
    const pageUrlStripped = window.location.href.replace(pageHash, '');
    const elem = e.target.closest('.park-button[href]');
    const listItem = elem.closest('.park-social-buttons__button');
    const trackingSuffix = listItem.getAttribute('data-tracking-suffix');
    const pageUrl = pageUrlStripped.indexOf('?') > -1 ? pageUrlStripped + trackingSuffix + pageHash : `${pageUrlStripped}?${trackingSuffix}${pageHash}`;

    // Storing a backup of the original href in data-href
    if (!elem.hasAttribute('data-href')) {
      elem.setAttribute('data-href', elem.href);
    }

    elem.href = elem.getAttribute('data-href');
    elem.href = elem.href.replace(/{{(\s|%20)title(\s|%20)}}/g, encodeURIComponent(pageTitle));
    elem.href = elem.href.replace(/{{(\s|%20)url(\s|%20)}}/g, encodeURIComponent(pageUrl));
  });
})();

