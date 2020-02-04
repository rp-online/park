(() => {
  // Since IE's JavaScript-Engine has a big penalty with
  // higher order array builtins, like .concat(), .forEach() or .filter(),
  // we use a lot of old fashioned loops in here.

  const initObserverStack = {};
  const initTimers = window.WeakMap ? new WeakMap() : new Map();
  const observedElems = new Set();
  const liveElementCollection = document.getElementsByTagName('*');
  const elementObservers = {};
  const mutationObserverDefaultConfig = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true,
  };
  let domUpdated = true;

  function init(selector, node) {
    initObserverStack[selector].forEach((entry) => {
      entry.callback(node);
    });
  }

  function handleEvent(e) {
    const registeredSelectors = Object.keys(initObserverStack);
    const node = e.target;

    if (node.nodeType !== 1) {
      return;
    }

    if (observedElems.has(node)) {
      return;
    }

    observedElems.add(node);

    registeredSelectors.forEach((selector) => {
      if (!node.matches(selector)) {
        return;
      }

      init(selector, node);
    });
  }

  function callback(entries, observer) {
    const entriesLength = entries.length;
    let i = 0;

    const registeredSelectors = Object.keys(initObserverStack);
    const registeredSelectorsLength = registeredSelectors.length;

    for (; i < entriesLength; i += 1) {
      const entry = entries[i];
      let j = 0;

      if (entry.intersectionRatio > 0) {
        const initCallbacks = [];

        for (; j < registeredSelectorsLength; j += 1) {
          const selector = registeredSelectors[j];

          if (entry.target.matches(selector)) {
            initCallbacks.push({
              selector,
              node: entry.target,
            });
          }
        }

        // InitTimer waits if the element gets scrolled by
        if (initCallbacks.length > 0) {
          initTimers.set(entry.target, window.setTimeout(() => {
            observer.unobserve(entry.target);
            initCallbacks.forEach((params) => {
              init(params.selector, params.node);
            });
            initTimers[entry.target] = undefined;
          }, 50));
        }
      } else {
        const timer = initTimers.get(entry.target);
        window.clearTimeout(timer);
      }
    }
  }

  const intersectionObserver = window.IntersectionObserver ? new IntersectionObserver(callback, {
    root: null,
    rootMargin: '100px 50px 300px 50px',
    threshold: 0.001,
  }) : undefined;

  function walkNodes() {
    if (!domUpdated) {
      return;
    }

    if (document.readyState !== 'loading') {
      domUpdated = false;
    }

    const registeredSelectors = Object.keys(initObserverStack);
    const joinedRegisteredSelectors = registeredSelectors.join(',');
    const registeredSelectorsLength = registeredSelectors.length;
    const liveElementCollectionLength = liveElementCollection.length;
    let i = 0;

    if (!liveElementCollectionLength || !registeredSelectorsLength) {
      return;
    }

    for (; i < liveElementCollectionLength; i += 1) {
      const node = liveElementCollection[i];

      if (observedElems.has(node)) {
        /* eslint-disable no-continue */
        continue;
      }

      observedElems.add(node);

      if (!node.matches(joinedRegisteredSelectors)) {
        /* eslint-disable no-continue */
        continue;
      }

      let k = 0;

      for (; k < registeredSelectorsLength; k += 1) {
        const selector = registeredSelectors[k];

        if (node.matches(selector)) {
          if (
            !window.IntersectionObserver ||
            initObserverStack[selector].findIndex(entry => entry.lazy) === -1
          ) {
            init(selector, node);
          } else {
            intersectionObserver.observe(node);
          }
        }
      }
    }
  }

  window.setInterval(walkNodes, 250);

  document.addEventListener('DOMContentLoaded', () => {
    walkNodes();
    domUpdated = false;

    let mutationObserver;

    if (window.MutationObserver) {
      mutationObserver = new MutationObserver(() => {
        domUpdated = true;
        walkNodes();
      });

      mutationObserver.observe(document.documentElement, mutationObserverDefaultConfig);
    } else if (window.msAnimationStartTime) {
      document.documentElement.classList.add('no-mutation-observers');
      document.addEventListener('MSAnimationStart', handleEvent, true);
    }
  });

  window.park = Object.assign({}, window.park, {
    observer: {
      initialize(selector, callback, lazy = true) {
        if (!initObserverStack[selector]) {
          initObserverStack[selector] = [];
        }

        const callbackAlreadyRegistered = initObserverStack[selector]
          .findIndex(entry => entry.callback === callback);

        if (callbackAlreadyRegistered > -1) {
          return;
        }

        initObserverStack[selector].push({
          callback,
          lazy,
        });

        const elems = window.park.$(selector);
        let i = 0;

        for (; i < elems.length; i += 1) {
          const elem = elems[i];
          init(selector, elem);
        }
      },
      observe(elem, callback, config) {
        config = config || mutationObserverDefaultConfig;

        if (window.MutationObserver) {
          elementObservers[elem] = new MutationObserver((mutations) => {
            let i = 0;

            for (; i < mutations.length; i += 1) {
              if (callback) {
                callback();
              }
            }
          });

          elementObservers[elem].observe(elem, config);
        } else if (window.msAnimationStartTime) {
          elem.addEventListener('MSAnimationStart', (e) => {
            if (e.animationName !== 'park-node-inserted') {
              return;
            }

            if (callback) {
              callback();
            }
          }, true);
        }
      },
      disconnect(elem) {
        if (elementObservers[elem]) {
          elementObservers[elem].disconnect();
        }
      },
    },
  });
})();
