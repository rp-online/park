(() => {
  (() => {
    const elem = document.querySelector('link[rel="stylesheet"][href*="head.css"][data-client][data-version]');

    if (!elem) {
      return;
    }

    const url = elem.href;
    const client = elem.getAttribute('data-client');
    const version = elem.getAttribute('data-version');
    const storageKey = `park.head.css.${client}.${version}`;
    const styles = window.park.storage.get(storageKey);

    if (!styles) {
      const storageEntries = window.park.storage.keys();

      storageEntries.forEach((key) => {
        if (!key.startsWith('park.head.css')) {
          return;
        }

        window.park.storage.remove(key);
      });

      window
        .park
        .ajax(url)
        .then(result => result.text())
        .then((result) => {
          window.park.storage.set(storageKey, result);
        });
    }
  })();
  (() => {
    const elem = document.querySelector('script[src*="head.js"][data-client][data-version]');

    if (!elem) {
      return;
    }

    const url = elem.src;
    const client = elem.getAttribute('data-client');
    const version = elem.getAttribute('data-version');
    const storageKey = `park.head.js.${client}.${version}`;
    const scripts = window.park.storage.get(storageKey);

    if (!scripts) {
      const storageEntries = window.park.storage.keys();

      storageEntries.forEach((key) => {
        if (!key.startsWith('park.head.js')) {
          return;
        }

        window.park.storage.remove(key);
      });

      window
        .park
        .ajax(url)
        .then(result => result.text())
        .then((result) => {
          window.park.storage.set(storageKey, result);
        });
    }
  })();
})();
