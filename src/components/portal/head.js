(() => {
  if (!window.park.device.hasFastConnection()) {
    window.park.console.info('Disabling ads due to slow connection');
    return;
  }

  (() => {
    if (!document.currentScript) {
      return;
    }

    const originalDocumentWrite = document.write;

    document.write = (html) => {
      const sourceScript = document.currentScript;
      const div = document.createElement('div');
      const range = document.createRange();

      if (!sourceScript || !sourceScript.closest('.park-portal')) {
        originalDocumentWrite.apply(document, [html]);
        return;
      }

      window.park.console.warn('document.write was executed inside a portal', document.currentScript);

      range.setStart(div, 0);

      document.currentScript.parentElement.appendChild(div);
      div.appendChild(range.createContextualFragment(html));
    };
  })();

  function initAd(elem, lazy) {
    const html = elem.textContent;
    const portal = elem.closest('.park-portal');
    const range = document.createRange();
    const testForId = html.match(/id="([^"]+)"/);
    const containerId = testForId ? testForId[1] : '(no ID found)';

    if (elem.matches('.park-portal--sticky')) {
      const stickyFloater = document.createElement('div');
      const stickyFloaterText = document.createElement('div');

      stickyFloater.classList.add('park-portal__sticky-floater');
      portal.appendChild(stickyFloater);
      stickyFloaterText.classList.add('park-portal__sticky-floater-text');
      portal.appendChild(stickyFloaterText);

      portal.classList.add('park-portal--sticky');
      range.setStart(stickyFloater, 0);
      stickyFloater.appendChild(range.createContextualFragment(html));
    } else {
      range.setStart(portal, 0);
      portal.appendChild(range.createContextualFragment(html));
    }

    window.park.console.info(`Portal with ID "${containerId}" is being${lazy ? ' lazily' : ''} prepared`);
  }

  window.park.observer.initialize('.park-portal', (elem) => {
    function init() {
      let containerId = (elem.querySelector('[id]') || {}).id;
      const lazyWrapper = elem.querySelector('.park-portal--lazy');

      if (!containerId && lazyWrapper) {
        const regex = RegExp('id="([^"]+)"', 'img');
        const regexResult = regex.exec(lazyWrapper.textContent);

        if (regexResult) {
          containerId = regexResult[1];
        }
      }

      if (!containerId) {
        window.setTimeout(init, 100);
        return;
      }

      elem.setAttribute('data-portal-id', containerId);
    }

    init();
  }, false);

  window.park.observer.initialize('.park-portal--mobile', (elem) => {
    if (!window.park.device.isMobile() || elem.matches('.park-portal--lazy')) {
      return;
    }

    initAd(elem, false);
  }, false);

  window.park.observer.initialize('.park-portal--desktop', (elem) => {
    if (window.park.device.isMobile() || elem.matches('.park-portal--lazy')) {
      return;
    }

    initAd(elem, false);
  }, false);

  window.park.observer.initialize('.park-portal--lazy', (elem) => {
    if (window.park.device.isMobile() && elem.matches('.park-portal--mobile')) {
      initAd(elem, true);
    }
    if (!window.park.device.isMobile() && elem.matches('.park-portal--desktop')) {
      initAd(elem, true);
    }
  });
})();
