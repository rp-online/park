(() => {
  /* Sadly Safari < 11.3 fails at showing <img> elements pointing to stacked SVGs,
   see: https://betravis.github.io/icon-methods/svg-sprite-sheets.html
   */
  const files = {};

  function replace(elem, fileUrl, target) {
    if (!files[fileUrl]) {
      window.setTimeout(() => {
        replace(elem, fileUrl, target);
      }, 100);
      return;
    }

    window.requestAnimationFrame(() => {
      elem.src = files[fileUrl][target];
    });
  }

  window.park.observer.initialize('img[src*=".svg#"]', (elem) => {
    const fileUrl = elem.src.replace(/#.*$/, '');
    const target = elem.src.replace(/^.*#(.*)$/, '$1');

    if (files[fileUrl] === undefined) {
      files[fileUrl] = '';

      window
        .park
        .ajax(fileUrl)
        .then(result => result.text())
        .then((result) => {
          const parts = result.split('<svg ');
          const partsLength = parts.length;
          const map = {};
          let i = 0;

          for (;i < partsLength; i += 1) {
            const part = parts[i];

            if (part.startsWith('id="')) {
              const id = part.replace(/id="([^"]+)"[\w\W]+/, '$1');
              const image = part.replace(/[\w\W]+xlink:href="([^"]+)"[\w\W]+/, '$1');

              map[id] = image;
            }
          }

          files[fileUrl] = map;
        });
    }

    replace(elem, fileUrl, target);
  }, false);
})();
