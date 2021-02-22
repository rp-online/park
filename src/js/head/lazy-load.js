(() => {
  const mediaQueryList = window.matchMedia ? window.matchMedia('print') : undefined;
  const observedElems = new Set();

  const lazyLoad = (
    window.park.exports &&
    window.park.exports.config &&
    window.park.exports.config.lazyload
  );

  let rootMargin = lazyLoad ? window.park.exports.config.lazyload : '100px 50px 200px 50px';
  rootMargin = rootMargin.toString().replace(/,/gi, ' ');

  function replace(oldElement) {
    if (window.park.device.isOffline()) {
      window.setTimeout(() => {
        replace(oldElement);
      }, 1000);
    }

    const oldId = oldElement.id;
    const oldClassName = oldElement.className;
    const oldRole = oldElement.getAttribute('role');
    const oldAriaLabelledby = oldElement.getAttribute('aria-labelledby');
    const noscript = oldElement.querySelector('noscript');
    const dom = document.createElement('div');

    if (!noscript) {
      return;
    }

    dom.innerHTML = noscript.textContent ?
      noscript.textContent.replace(/<!--.+?-->/g, '').trim() : noscript.innerHTML.replace(/<!--.+?-->/g, '').trim();

    const newElement = dom.firstElementChild;
    let src;

    if (oldId) {
      newElement.id = oldId;
    }

    if (oldClassName) {
      newElement.className = oldClassName;
    }

    if (oldRole) {
      newElement.setAttribute('role', oldRole);
    }

    if (oldAriaLabelledby) {
      newElement.setAttribute('aria-labelledby', oldAriaLabelledby);
    }

    switch (newElement.nodeName.toLowerCase()) {
      case 'img':
        src = newElement.getAttribute('src').replace(/\s/g, '');
        if (src && src.substr(0, 5) !== 'data:') {
          const image = new Image();
          const t0 = window.performance ? performance.now() : ((new Date()).getTime() * 1000);

          image.onload = () => {
            const t1 = window.performance ? performance.now() : ((new Date()).getTime() * 1000);

            if (!newElement || !oldElement) {
              return;
            }

            if ((t1 - t0) < 20000) {
              newElement.classList.add('from-cache');
            }

            if ('decode' in image) {
              try {
                image.decode()
                  .then(() => {
                    if (oldElement.parentNode) {
                      oldElement.parentNode.replaceChild(newElement, oldElement);
                    }
                  })
                  .catch((e) => {
                    window.park.console.error(`Error decoding image ${src}`);
                    window.park.console.log(e);
                    oldElement.parentNode.replaceChild(newElement, oldElement);
                  });
              } catch (e) {
                window.park.console.error(`Error decoding image ${src}`);
                window.park.console.log(e);
                oldElement.parentNode.replaceChild(newElement, oldElement);
              }
            } else if (oldElement.parentNode) {
              oldElement.parentNode.replaceChild(newElement, oldElement);
            }
          };
          image.onerror = () => {
            window.park.console.error(`Error lazy loading image ${src}`);
          };
          image.src = src;
        } else {
          if (!newElement || !oldElement) {
            return;
          }

          newElement.classList.add('from-cache');
          if (oldElement.parentNode) {
            oldElement.parentNode.replaceChild(newElement, oldElement);
          }
        }
        break;

      default:
        if (!newElement || !oldElement) {
          return;
        }

        if (oldElement.parentNode) {
          oldElement.parentNode.replaceChild(newElement, oldElement);
        }
        break;
    }
  }

  function callback(entries, observer) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0.01) {
        observer.unobserve(entry.target);

        replace(entry.target);
      }
    });
  }

  const observer = window.IntersectionObserver ? new IntersectionObserver(callback, {
    root: null,
    rootMargin,
    threshold: 0.1,
  }) : undefined;

  function replaceAll() {
    console.log('replaceAll!');

    observedElems.forEach((elem) => {
      observedElems.delete(elem);
      observer.unobserve(elem);
      replace(elem);
    });
  }

  window.park = Object.assign({}, window.park, {
    lazyLoad(elem) {
      if (window.IntersectionObserver) {
        observer.observe(elem);
        observedElems.add(elem);
      } else {
        replace(elem);
      }
    },
  });

  if (window.IntersectionObserver) {
    window.addEventListener('beforeprint', replaceAll);

    if (!window.matchMedia) {
      return;
    }

    mediaQueryList.addListener((mql) => {
      if (mql.matches) {
        replaceAll();
      }
    });
  }
})();
