(() => {
  // need map for foreach
  const popoverInstances = new Map();
  const url = `${window.park.exports.config.rootBase}/assets/popper.js?v=${window.park.exports.config.version}`;
  let debounceTimer;

  function createPopper(elem, popover, options) {
    return new window.Popper(elem, popover, {
      placement: options.position,
      modifiers: {
        preventOverflow: {
          boundariesElement: document.querySelector('body'),
          padding: 0,
        },
        arrow: {
          enabled: true,
        },
        removeOnDestroy: true,
      },
    });
  }

  function registerPopover(elem) {
    if (popoverInstances.has(elem)) {
      return popoverInstances.get(elem);
    }

    const options = Object.assign({}, {
      position: 'bottom',
      showCloseButton: false,
      backgroundColor: 'white',
      openEvents: 'mouseenter',
      closeEvents: '',
      data: {},
      config: window.park.exports.config,
    }, JSON.parse(elem.getAttribute('data-popover')));

    const popover = window.park.widgets.create({
      type: 'popover',
      initialState: options,
    });

    const thisPopover = {
      popperInstance: null,
      elem,
      injected: false,
      options,
      addPopover: () => {
        if (!thisPopover.element) {
          window.setTimeout(thisPopover.addPopover, 100);
          return;
        }

        if (!thisPopover.popperInstance && thisPopover.injected) {
          thisPopover.popperInstance = createPopper(
            thisPopover.elem,
            thisPopover.element,
            thisPopover.options
          );
          thisPopover.element.style.display = 'block';
          window.park.overlayManager.register(
            thisPopover.element,
            thisPopover.removePopover,
            true
          );
        }
      },
      removePopover: () => {
        if (thisPopover.popperInstance) {
          thisPopover.element.style.display = 'none';
          thisPopover.popperInstance.destroy();
          thisPopover.popperInstance = null;
          window.park.overlayManager.unregister(thisPopover.element);
        }
      },
    };

    window.park.eventHub.register('park.widget:rendered', popover, (e) => {
      if (e.target === popover && !thisPopover.injected) {
        e.target.removeAttribute('data-type');
        thisPopover.element = e.target.querySelector('.park-popover');
        thisPopover.element.removeAttribute('data-type');
        thisPopover.injected = true;
      }
    });

    document.querySelector('body').appendChild(popover);
    popoverInstances.set(elem, thisPopover);

    return thisPopover;
  }

  // register open handler
  window.park.eventHub.register('click mouseenter', '[data-popover]', (e) => {
    const elem = e.target;

    e.preventDefault();
    e.stopPropagation();

    window.park.resourceLoader.script(url, () => {
      const popover = registerPopover(elem.closest('[data-popover]'));

      if (!popover) {
        return;
      }

      const openEvents = popover.options.openEvents.split(' ');
      if (openEvents.indexOf(e.type) < 0) {
        return;
      }

      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        popover.addPopover();
      }, 200);
    });
  });

  // register close handler
  window.park.eventHub.register('mouseleave', '[data-popover]', (e) => {
    const popover = popoverInstances.get(e.target);
    if (!popover) {
      return;
    }
    const closeEvents = popover.options.closeEvents.split(' ');
    if (closeEvents.indexOf(e.type) < 0) {
      return;
    }
    popover.removePopover();
  });

  // register close button
  window.park.eventHub.register('click', '.park-popover__close', (e) => {
    const popoverTarget = e.target.closest('.park-popover');
    if (!popoverTarget) {
      return;
    }
    popoverInstances.forEach((popOver) => {
      if (popOver.element === popoverTarget) {
        popOver.removePopover();
      }
    });
  });

  window.park.eventHub.register('resize', window, () => {
    popoverInstances.forEach(p => p.removePopover());
  });

  window.addEventListener('scroll', () => {
    popoverInstances.forEach(p => p.removePopover());
  });

  window.park.observer.initialize('[data-popover]', () => {
    window.park.resourceLoader.preload(url, 'script');
  });
})();
