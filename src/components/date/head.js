(() => {
  const elems = [];
  let timer;

  function updateDateDisplay() {
    const now = (new Date()).getTime();

    elems.forEach((elem) => {
      const elemTimestamp = parseInt(elem.getAttribute('data-timestamp'), 10) * 1000;
      const diff = now - elemTimestamp;
      const diffMinutes = Math.floor(diff / 60000);

      if (diffMinutes > 0 && diffMinutes < 10) {
        if (!elem.hasAttribute('data-text')) {
          elem.setAttribute('data-text', elem.textContent);
        }

        switch (diffMinutes) {
          case 0:
            elem.textContent = 'Eben aktualisiert';
            break;

          case 1:
            elem.textContent = 'Aktualisiert vor einer Minute';
            break;

          default:
            elem.textContent = `Aktualisiert vor ${diffMinutes} Minuten`;
            break;
        }
      } else if (elem.hasAttribute('data-text')) {
        elem.textContent = elem.getAttribute('data-text');
        elem.removeAttribute('data-text');
      }

      elem.style.opacity = 1;
    });
  }

  window.setInterval(updateDateDisplay, 60000);

  window.park.observer.initialize('.park-date', (elem) => {
    elems.push(elem);

    window.clearTimeout(timer);
    timer = window.setTimeout(updateDateDisplay, 50);
  }, false);
})();
