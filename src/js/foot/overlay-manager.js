(() => {
  const isSafari = /constructor/i.test(window.HTMLElement);
  const root = document.documentElement;
  let overlayStack = [];
  let previousScrollBehavior = '';
  let previousScrollTop = 0;

  window.park = Object.assign({}, window.park, {
    overlayManager: {
      register: (overlayElem, overlayCloseFn, noBackdrop) => {
        const scrollingElement = document.scrollingElement ?
          document.scrollingElement : document.body;

        if (!scrollingElement) {
          window.setTimeout(() => {
            window.park.overlayManager.register(overlayElem, overlayCloseFn, noBackdrop);
          }, 100);
          return;
        }

        window.park.eventHub.trigger(document, 'park.overlay:open', {
          elem: overlayElem,
        });

        if (!noBackdrop && !root.classList.contains('overlay-open') && !overlayStack.filter(entry => entry.backdrop).length) {
          root.classList.add('overlay-open');
          if (!window.park.device.isMobile() || !isSafari) {
            previousScrollBehavior = scrollingElement.style.scrollBehavior;
            previousScrollTop = scrollingElement.scrollTop;
            Object.assign(scrollingElement.style, {
              position: 'fixed',
              top: `${previousScrollTop * -1}px`,
              overflow: 'hidden',
              touchAction: 'pinch-zoom',
              scrollBehavior: 'auto',
            });
          }
        }

        overlayStack.push({
          elem: overlayElem,
          closeFn: overlayCloseFn,
          backdrop: !noBackdrop,
        });
      },
      unregister: (overlayElem) => {
        const scrollingElement = document.scrollingElement ?
          document.scrollingElement : document.body;

        if (!scrollingElement) {
          window.setTimeout(() => {
            window.park.overlayManager.unregister(overlayElem);
          }, 100);
          return;
        }

        window.park.eventHub.trigger(document, 'park.overlay:close', {
          elem: overlayElem,
        });

        overlayStack = overlayStack.filter(overlay => overlay.elem !== overlayElem);

        if (root.classList.contains('overlay-open') && !overlayStack.filter(entry => entry.backdrop).length) {
          root.classList.remove('overlay-open');
          if (!window.park.device.isMobile() || !isSafari) {
            Object.assign(scrollingElement.style, {
              position: '',
              overflow: '',
              top: '',
              touchAction: '',
            });
            scrollingElement.scrollTop = previousScrollTop;
            scrollingElement.style.scrollBehavior = previousScrollBehavior;
          }
        }
      },
      close: (id) => {
        const overlayElem = document.getElementById(`park-overlay-${id}`) || document.getElementById(id);

        if (!overlayElem) {
          return false;
        }

        try {
          overlayElem.removeAttribute('open');
        } catch (e) {
          console.log('Catched error while trying to work with native <dialog> element');
        }

        overlayElem.setAttribute('aria-hidden', 'true');
        if (overlayElem.close) {
          try {
            overlayElem.close();
          } catch (e) {
            console.log('Catched error while trying to work with native <dialog> element');
          }
        }
        window.park.navigationHelper.releaseNav(overlayElem);
        window.park.overlayManager.unregister(overlayElem);
        return true;
      },
      open: (id) => {
        const overlayElem = document.getElementById(`park-overlay-${id}`) || document.getElementById(id);

        if (!overlayElem) {
          return false;
        }

        const closeFn = () => {
          window.park.overlayManager.close(id);
        };

        try {
          overlayElem.setAttribute('open', '');
          if (!overlayElem.hasAttribute('open') && overlayElem.showModal) {
            overlayElem.showModal();
          }
        } catch (e) {
          console.log('Catched error while trying to work with native <dialog> element');
        }

        overlayElem.removeAttribute('aria-hidden');
        overlayElem.focus();
        window.park.navigationHelper.captureNav(overlayElem);
        window.park.overlayManager.register(overlayElem, closeFn);

        return closeFn;
      },
    },
  });

  window.park.eventHub.register('ontouchstart' in window ? 'touchstart' : 'click', document, (e) => {
    if (!overlayStack.length) {
      return;
    }

    const clickedElement = e.target;
    const topmostOverlay = overlayStack[overlayStack.length - 1];
    const topmostOverlayId = topmostOverlay.elem.id;

    if (
      clickedElement === document.querySelector('body') ||
      clickedElement === document.documentElement
    ) {
      e.stopPropagation();
      topmostOverlay.closeFn();
      return;
    }

    if (topmostOverlay.elem.contains(clickedElement)) {
      return;
    }

    if (
      topmostOverlayId &&
      clickedElement.closest('[aria-controls]') &&
      topmostOverlayId === clickedElement.closest('[aria-controls]').getAttribute('aria-controls')
    ) {
      return;
    }

    const rect = topmostOverlay.elem.getBoundingClientRect();
    const isClickInside = rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isClickInside) {
      topmostOverlay.closeFn();
    }

    e.stopPropagation();
  });

  window.park.eventHub.register('keydown', document, (e) => {
    if (!overlayStack.length) {
      return;
    }

    if (e.key !== 'Escape' && e.key !== 'Esc') {
      return;
    }

    const activeElement = document.activeElement;
    const topmostOverlay = overlayStack[overlayStack.length - 1];

    if (!activeElement.matches('input, select, textarea, [contenteditable], label')) {
      topmostOverlay.closeFn();
    }

    if (activeElement.matches('input, textarea') && !activeElement.parkValue) {
      topmostOverlay.closeFn();
    }
  });
})();
