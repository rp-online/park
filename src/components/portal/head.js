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

  function triggerLoadEvent(elem, data) {
    const event = new CustomEvent('park.portal:load', {
      bubbles: true,
      cancelable: false,
      detail: data,
    });

    elem.dispatchEvent(event);
  }

  function markPortalAsEmpty(portal) {
    let currentClassNames = portal.className.split(' ');

    currentClassNames = currentClassNames.filter(className =>
      className !== 'park-portal--is-loaded' &&
      className !== 'park-portal--is-empty' &&
      !/park-portal--height-\d+/.test(className)
    );
    portal.className = `${currentClassNames.join(' ')} park-portal--is-loaded park-portal--is-empty`;
  }

  function handler(e) {
    const elem = e.target;

    if (!elem.matches || !elem.matches('.park-portal iframe, .park-portal img, .park-portal [style*="display: none"], .park-portal [style*="display:none"]')) {
      return;
    }

    const portal = elem.closest('.park-portal');
    const containerId = (portal.querySelector('[id]') || {}).id;

    window.setTimeout(() => {
      const treeInvisible = elem.closest('[style*="display: none"]');

      window.park.console.info(`Portal with ID "${containerId}" loaded`);

      if (treeInvisible) {
        const margin = parseInt(window.getComputedStyle(portal).getPropertyValue('margin-bottom'), 10);

        markPortalAsEmpty(portal);

        Object.assign(portal.style, {
          height: '',
          minHeight: '0',
          marginBottom: margin >= 0 ? '0' : '',
        });

        window.park.console.info(`Portal with ID "${containerId}" seems empty`);

        return;
      }

      if (elem.matches('.park-portal__sticky-floater *')) {
        return;
      }

      let height = 0;

      Object.assign(portal.style, {
        height: '',
        minHeight: '0',
        marginBottom: '',
      });

      window.setTimeout(() => {
        let currentClassNames = portal.className.split(' ');

        currentClassNames = currentClassNames.filter(className => className !== 'park-portal--is-loaded' && !/park-portal--height-\d+/.test(className));

        height = portal.offsetHeight;

        window.park.console.info(`Measured a height of ${height}px with portal ID "${containerId}"`);

        Object.assign(portal.style, {
          height: `${height}px`,
        });

        portal.className = `${currentClassNames.join(' ')} park-portal--is-loaded park-portal--height-${height}`;

        triggerLoadEvent(portal, {
          elem: portal,
          height,
        });
      });
    }, 1000);
  }

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

    window.park.console.info(`Portal with ID "${containerId}" is being${lazy ? ' lazily' : ''} loaded`);
  }

  document.addEventListener('load', handler, true);
  document.addEventListener('park.portal:resize', handler, true);
  document.addEventListener('MSAnimationStart', handler, true);
  document.addEventListener('webkitAnimationStart', handler, true);
  document.addEventListener('mozAnimationStart', handler, true);
  document.addEventListener('animationstart', handler, true);
  document.addEventListener('MSAnimationEnd', handler, true);
  document.addEventListener('webkitAnimationend', handler, true);
  document.addEventListener('mozAnimationEnd', handler, true);
  document.addEventListener('animationend', handler, true);

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

  window.park.observer.initialize('.park-portal [style*="display: none"], .park-portal [style*="display:none"]', (target) => {
    window.park.console.info('Found display: none child inside portal');

    handler({ target });
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
