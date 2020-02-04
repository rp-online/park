(() => {
  const windowOnlyEvents = [
    'resize',
  ];
  const throttleEvents = [
    'scroll',
    'resize',
  ];
  const passiveEvents = [
    'touchstart',
    'touchmove',
    'wheel',
    'mousewheel',
  ];
  const windowEvents = {};
  const delegatedEvents = {};
  let throttleQueue = {};

  const isContentLoaded = new Promise((resolve) => {
    if (document.readyState !== 'loading') {
      resolve();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        resolve();
      });
    }
  });

  window.setInterval(() => {
    const keys = Object.keys(throttleQueue);
    const keysLength = keys.length;
    let i = 0;

    for (;i < keysLength; i += 1) {
      const key = keys[i];

      throttleQueue[key]();
    }

    throttleQueue = {};
  }, 16);

  function registerThrottledEvent(elem, eventType, callback) {
    elem.addEventListener(eventType, (e) => {
      if (!throttleQueue[callback]) {
        throttleQueue[callback] = () => {
          callback(e);
        };
      }
    }, passiveEvents.indexOf(eventType) > -1 ? {
      capture: true,
      passive: true,
    } : true);
  }

  function registerWindowOnlyEvent(eventType, callback) {
    if (!windowEvents[eventType]) {
      windowEvents[eventType] = [];
    }

    if (windowEvents[eventType]
      .findIndex(e => e.callback === callback) === -1) {
      windowEvents[eventType].push({
        callback,
      });

      isContentLoaded.then(() => {
        if (throttleEvents.indexOf(eventType) === -1) {
          window.addEventListener(eventType, callback);
        } else {
          registerThrottledEvent(window, eventType, callback);
        }
      });
    }
  }

  function registerDelegatableEvent(eventType, selector, callback) {
    if (!delegatedEvents[eventType]) {
      const eventOptions = passiveEvents.indexOf(eventType) > -1 ? {
        capture: true,
        passive: true,
      } : true;

      delegatedEvents[eventType] = [];
      document.addEventListener(eventType, (e) => {
        if (!e.target) {
          return;
        }

        if (e.target.nodeType !== 1) {
          return;
        }

        const stopImmediatePropagationElems = [];

        e.stopImmediatePropagation = () => {
          stopImmediatePropagationElems.push(e.target);
        };

        delegatedEvents[eventType].forEach((entry) => {
          if (
            entry.selector === document ||
            entry.selector instanceof Document ||
            entry.selector instanceof HTMLElement
          ) {
            entry.callback(e);
            return;
          }

          if (!e.target.matches) {
            return;
          }

          if (stopImmediatePropagationElems.indexOf(e.target) > -1) {
            return;
          }

          if (e.target.matches(entry.selector)) {
            entry.callback(e);
            return;
          }

          if (eventType.indexOf('nimation') === -1) {
            const actionableParent = e.target !== document ? e.target.closest('a, button') : null;

            if (actionableParent && actionableParent.matches(entry.selector)) {
              entry.callback(e);
            }
          }
        });
      }, eventOptions);
    }

    delegatedEvents[eventType].push({
      selector,
      callback,
    });
  }

  function register(eventTypes, selector, callback) {
    eventTypes.split(' ').forEach((eventType) => {
      if (windowOnlyEvents.indexOf(eventType) > -1) {
        registerWindowOnlyEvent(eventType, callback);
      } else {
        registerDelegatableEvent(eventType, selector, callback);
      }
    });
  }

  window.park = Object.assign({}, window.park, {
    eventHub: {
      register,
      trigger: window.park.eventHub ? window.park.eventHub.trigger : () => {},
    },
  });
})();
