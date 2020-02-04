(() => {
  function select(element) {
    let selectedText;

    if (element.nodeName === 'SELECT') {
      element.focus();

      selectedText = element.value;
    } else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
      const isReadOnly = element.hasAttribute('readonly');

      if (!isReadOnly) {
        element.setAttribute('readonly', '');
      }

      element.select();
      element.setSelectionRange(0, element.value.length);

      if (!isReadOnly) {
        element.removeAttribute('readonly');
      }

      selectedText = element.value;
    } else {
      if (element.hasAttribute('contenteditable')) {
        element.focus();
      }

      const selection = window.getSelection();
      const range = document.createRange();

      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);

      selectedText = selection.toString();
    }

    return selectedText;
  }

  function copy(text) {
    const element = document.createElement('textarea');
    const previouslyFocusedElement = document.activeElement;
    const yPosition = document.scrollingElement.scrollTop || document.documentElement.scrollTop;

    Object.assign(element.style, {
      position: 'absolute',
      top: `${yPosition}px`,
      left: '-9999px',
      margin: '0',
      padding: '0',
      border: '0',
      fontSize: '12pt',
    });

    element.setAttribute('readonly', '');
    element.value = text;

    document.querySelector('body').appendChild(element);

    select(element);
    document.execCommand('copy');
    document.querySelector('body').removeChild(element);
    previouslyFocusedElement.focus();

    window.park.notifications.create({
      id: 'copy-success',
      data: {
        headline: 'Die Seiten-URL wurde erfolgreich in die Zwischenablage kopiert!',
        type: 'success',
      },
    });
  }

  window.park.eventHub.register('ontouchstart' in window ? 'touchstart' : 'click', '[data-copy]', (e) => {
    const trackingSuffix = 'utm_source=copy&utm_medium=referral&utm_campaign=share';
    const pageHash = window.location.hash;
    const pageUrlStripped = window.location.href.replace(pageHash, '');
    const pageUrl = pageUrlStripped.indexOf('?') > -1 ? pageUrlStripped + trackingSuffix + pageHash : `${pageUrlStripped}?${trackingSuffix}${pageHash}`;
    const elem = e.target.closest('[data-copy]');
    const text = elem.getAttribute('data-copy') || pageUrl;

    copy(text);

    e.preventDefault();
  });

  window.clipboardCopy = copy;
})();
