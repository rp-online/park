(() => {
  const EasingFunctions = {
    // no easing, no acceleration
    linear(t) {
      return t;
    },
    // decelerating to zero velocity
    easeOutQuad(t) {
      return t * (2 - t);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad(t) {
      /* eslint-disable no-mixed-operators */
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic(t) {
      /* eslint-disable no-mixed-operators */
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    // decelerating to zero velocity
    easeOutQuart(t) {
      /* eslint-disable no-plusplus */
      return 1 - (--t) * t * t * t;
    },
  };

  const scrollingElement = document.scrollingElement ? document.scrollingElement : document.body;
  let animations = [];

  window.park.eventHub.register('touchstart', '*', (e) => {
    const elem = e.target;

    animations = animations.filter(anim => anim.elem !== elem && !anim.elem.contains(elem));
  });

  function animationLoop(time) {
    animations = animations.map((anim) => {
      if (!anim.elem) {
        return false;
      }

      if (!anim.startTime) {
        anim.startTime = time;
      }

      const durationFraction = EasingFunctions.easeOutQuad(
        Math.min(1, (time - anim.startTime) / anim.duration)
      );

      const travelDistance = anim.scrollTo - anim.startPosition;
      const travelTarget = anim.startPosition + (travelDistance * durationFraction);

      if ('scrollBehavior' in document.documentElement.style) {
        let scrollOptions;

        if (anim.property === 'scrollLeft') {
          scrollOptions = {
            top: anim.elem.scrollTop,
            left: travelTarget,
            behavior: 'smooth',
          };
        } else {
          scrollOptions = {
            top: travelTarget,
            left: anim.elem.scrollLeft,
            behavior: 'smooth',
          };
        }

        anim.elem.scrollTo(scrollOptions);
      } else {
        anim.elem[anim.property] = anim.startPosition + (travelDistance * durationFraction);
      }

      if (durationFraction >= 1) {
        if (anim.callback) {
          anim.callback(anim.elem);
        }
        return false;
      }

      return anim;
    }).filter(anim => !!anim);

    if (animations.length) {
      window.requestAnimationFrame(animationLoop);
    }
  }

  window.park = Object.assign({}, window.park, {
    smoothScroll: ['left', 'top'].reduce((acc, direction) => {
      acc[direction] = (options, callback) => {
        if (!options.elem) {
          return;
        }

        let property = '';

        if (direction === 'left') {
          property = 'scrollLeft';
        } else {
          property = 'scrollTop';
        }

        const startPosition = options.elem[property];

        const anim = {
          elem: options.elem,
          startPosition,
          scrollTo: options.scrollTo,
          travelDistance: options.scrollTo - options.elem[property],
          duration: options.duration || 600,
          property,
          callback,
        };

        animations = animations.filter(anim => anim.elem !== options.elem);
        animations.push(anim);

        if (animations.length === 1) {
          window.requestAnimationFrame(animationLoop);
        }
      };

      return acc;
    }, {}),
    offset: (elem) => {
      const rect = elem.getBoundingClientRect();
      const scrollLeft = document.body.scrollLeft;
      const scrollTop = document.body.scrollTop;

      return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
      };
    },
  });

  document.addEventListener('DOMContentLoaded', () => {
    window.setTimeout(() => {
      window.park.eventHub.register('click', '*', (e) => {
        const link = e.target.closest('a[href^="#"]:not([role]):not(.park-header__skiplink)');

        if (!link) {
          return;
        }

        const target = document.getElementById(link.getAttribute('href').replace('#', ''));

        if (!target) {
          return;
        }

        const targetPos = scrollingElement.scrollTop + window.park.offset(target).top;
        const scrollTo = targetPos - 150;

        window.park.smoothScroll.top({
          elem: scrollingElement,
          scrollTo,
          duration: 600,
        }, () => {
          target.focus();
        });

        if (window.park.eventHub) {
          window.park.eventHub.trigger(document, 'park.smooth-scroll:scroll', {
            elem: target,
          });
        }

        e.preventDefault();
      });
    }, 100);
  });
})();
