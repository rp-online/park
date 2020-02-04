(() => {
  const $ = window.park.$;
  const maxSlideDuration = 150;
  const heightOffset = 50;
  const heightTimers = {};
  const lastHeight = {};
  const observedPortalSlides = new Set();
  const lastScrollPos = window.WeakMap ? new WeakMap() : new Map();
  const scrollDirection = window.WeakMap ? new WeakMap() : new Map();
  const swipeDirection = window.WeakMap ? new WeakMap() : new Map();
  const animatedSliders = window.WeakSet ? new WeakSet() : new Set();
  let manipulatedSlider;
  let pauseTrackpageview = false;
  let oldLocation = window.location.href.replace('#0', '');
  let swipeTimeout;

  function isVisible(slider) {
    if (window.IntersectionObserver) {
      return slider.classList.contains('park-gallery--is-visible');
    }
    return true;
  }

  function trackPageview(slider) {
    if (pauseTrackpageview) {
      return;
    }

    if (oldLocation === window.location.href.replace('#0', '')) {
      return;
    }

    oldLocation = window.location.href.replace('#0', '');
    const url = window.location.href.replace(/#.+$/, '');

    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, slider.closest('.park-article') ? 'park.article.gallery:pageview' : 'park.gallery:pageview', {
        url,
      });
    }
  }

  function adaptHeightToScrollPosition(slider) {
    const sliderList = slider.querySelector('.park-gallery__list');
    const sliderItems = $('.park-gallery__item', sliderList);
    const sliderItemPositions = sliderItems.map(item => item.offsetLeft);

    const sliderWidth = slider.offsetWidth;
    const sliderMaxHeight = sliderItems.reduce(
      (a, b) => (b.scrollHeight > a ? b.scrollHeight : a), 0);
    const currentIndex = (() => {
      if ((sliderList.scrollLeft + sliderWidth) >= (sliderList.scrollWidth - 10)) {
        return (sliderItems.length - 1);
      }

      return sliderItemPositions.findIndex(
        pos => pos >= sliderList.scrollLeft
      );
    })();
    const currentSlideHeight = sliderItems.length ? sliderItems[currentIndex].scrollHeight : 0;

    if (currentSlideHeight === lastHeight[slider]) {
      return;
    }

    lastHeight[slider] = currentSlideHeight;

    clearTimeout(heightTimers[slider]);
    heightTimers[slider] = setTimeout(() => {
      Object.assign(sliderList.style, {
        height: `${(sliderMaxHeight + heightOffset) / 16}rem`,
        maxHeight: `${(currentSlideHeight + heightOffset) / 16}rem`,
      });
    }, 200);
  }

  function scrollSlider(slider, direction, index) {
    const sliderList = slider.querySelector('.park-gallery__list');
    const sliderItems = $('.park-gallery__item', sliderList);

    if (!sliderItems.length || sliderItems.length <= index) {
      window.setTimeout(() => {
        scrollSlider(slider, direction, index);
      }, 100);
      return;
    }

    const currentHash = parseInt(window.location.hash.replace('#', ''), 10) || 0;
    const sliderItemFirst = sliderItems[0];
    const sliderItemWidth = sliderItemFirst.offsetWidth;
    const sliderItemPositions = sliderItems.map(item => item.offsetLeft);
    let slideToIndex = 0;

    switch (direction) {
      default:
        slideToIndex = index;
        break;

      case 'closest': {
        const momentumDirection = scrollDirection.get(slider);
        const lastScrollPosition = lastScrollPos.get(slider) ?
          lastScrollPos.get(slider).position : sliderList.scrollLeft;

        scrollDirection.delete(slider);

        const sortedSliderItemDistances = sliderItemPositions
          .slice()
          .filter((pos) => {
            if (momentumDirection === undefined) {
              return true;
            }

            if (momentumDirection === 'left' && pos < lastScrollPosition) {
              return true;
            }

            if (momentumDirection === 'right' && pos > lastScrollPosition) {
              return true;
            }

            return false;
          })
          .sort((posA, posB) => {
            const distanceA = Math.abs(posA - sliderList.scrollLeft);
            const distanceB = Math.abs(posB - sliderList.scrollLeft);

            if (distanceA < distanceB) {
              return -1;
            }

            if (distanceA > distanceB) {
              return 1;
            }

            return 0;
          }, 0);

        slideToIndex = sliderItemPositions.indexOf(sortedSliderItemDistances[0]);
        break;
      }

      case 'left': {
        const pos = sliderItemPositions.reverse().find(
          pos => pos <
            sliderList.scrollLeft -
            (sliderItemWidth * 0.75)
        );

        slideToIndex = sliderItemPositions.reverse().indexOf(pos);
        break;
      }

      case 'right': {
        const pos = sliderItemPositions.find(
          pos => pos > sliderList.scrollLeft + (sliderItemWidth * 0.25)
        );

        slideToIndex = sliderItemPositions.indexOf(pos);

        if (slideToIndex === -1) {
          slideToIndex = 0;
        }
        break;
      }
    }

    if (slideToIndex === -1) {
      slideToIndex = (sliderItemPositions.length - 1);
    }

    if (currentHash !== slideToIndex) {
      if (slideToIndex > 0 || window.location.hash !== '#0') {
        window.location.href = `${window.location.href.replace(/#.+$/, '')}#${slideToIndex}`;
      }
    } else {
      const sliderItemPositions = sliderItems.map(item => item.offsetLeft);
      const slideToPos = sliderItemPositions[slideToIndex];
      const slideDuration = Math.max(1, Math.min(
        maxSlideDuration,
        Math.abs(sliderList.scrollLeft - slideToPos) * 2
      ));

      if (sliderList.scrollLeft === slideToPos) {
        return;
      }

      animatedSliders.add(slider);

      window.park.smoothScroll.left({
        elem: sliderList,
        scrollTo: slideToPos,
        duration: slideDuration,
      }, () => {
        animatedSliders.delete(slider);
        scrollDirection.delete(slider);
        lastScrollPos.delete(slider);
        if (window.park.eventHub) {
          window.park.eventHub.trigger(document, 'park.gallery:slided', {
            elem: slider,
            targetSlide: slideToIndex,
          });
        }
      });
    }
  }

  function hashScroll() {
    const sliders = window.park.$('.park-gallery');

    if (!sliders.length) {
      return;
    }

    const slider = sliders[0];

    if (animatedSliders.has(slider)) {
      return;
    }

    const slideToIndex = parseInt(window.location.hash.replace('#', ''), 10) || 0;

    scrollSlider(slider, undefined, slideToIndex);

    trackPageview(slider);

    if (slideToIndex === 0 && window.history && window.location.hash === '#0') {
      window.history.replaceState('', document.title, window.location.pathname);
    }
  }

  function momentumScroll(slider) {
    if (manipulatedSlider === slider) {
      return;
    }

    if (animatedSliders.has(slider)) {
      return;
    }

    const scrollElem = slider.querySelector('.park-gallery__list');
    const lastScrollPosition = lastScrollPos.get(slider);

    if (lastScrollPosition && lastScrollPosition.position !== undefined) {
      if (lastScrollPosition.position < (scrollElem.scrollLeft - 30)) {
        scrollDirection.set(slider, 'right');
      } else if (lastScrollPosition.position > (scrollElem.scrollLeft + 30)) {
        scrollDirection.set(slider, 'left');
      } else {
        scrollDirection.set(slider, undefined);
      }
    } else {
      animatedSliders.delete(slider);
      scrollDirection.delete(slider);
      lastScrollPos.delete(slider);
      return;
    }

    scrollSlider(slider, 'closest');
  }

  document.addEventListener('touchstart', (e) => {
    const slider = e.target.closest('.park-gallery');

    if (!slider) {
      return;
    }

    manipulatedSlider = slider;

    const scrollElem = slider.querySelector('.park-gallery__list');
    const now = (new Date()).getTime();
    const touchPosition = e.touches[0];

    lastScrollPos.set(slider, {
      time: now,
      position: scrollElem.scrollLeft,
      touchPosition,
    });
  });

  document.addEventListener('touchmove', (e) => {
    const slider = e.target.closest('.park-gallery');

    if (!slider) {
      return;
    }

    const lastScrollPosition = lastScrollPos.get(slider);
    const scrollElem = slider.querySelector('.park-gallery__list');
    const now = (new Date()).getTime();
    const touchPosition = e.touches[0];

    const newPageScrollTopOffset = touchPosition.pageY - lastScrollPosition.touchPosition.pageY;
    const newSliderScrollLeftOffset = touchPosition.pageX - lastScrollPosition.touchPosition.pageX;

    lastScrollPos.set(slider, {
      time: now,
      position: lastScrollPosition.position,
      touchPosition,
    });

    if (Math.abs(newPageScrollTopOffset) < Math.abs(newSliderScrollLeftOffset)) {
      if (!swipeDirection.has(slider)) {
        swipeDirection.set(slider, 'horizontal');
      }
    } else if (!swipeDirection.has(slider)) {
      swipeDirection.set(slider, 'vertical');
    }

    if (swipeDirection.get(slider) === 'horizontal') {
      scrollElem.scrollLeft -= newSliderScrollLeftOffset;
      e.preventDefault();
    }
  }, {
    capture: true,
    passive: false,
  });

  document.addEventListener('touchend', (e) => {
    const slider = e.target.closest('.park-gallery');

    if (!slider) {
      return;
    }

    window.clearTimeout(swipeTimeout);
    swipeDirection.delete(slider);
    manipulatedSlider = undefined;
    momentumScroll(slider);
  });

  window.park.eventHub.register('scroll', '.park-gallery__list', (e) => {
    const slider = e.target.closest('.park-gallery');
    const scrollElem = slider.querySelector('.park-gallery__list');
    const now = (new Date()).getTime();
    const touchPosition = {
      pageX: 0,
      pageY: 0,
    };

    if (lastScrollPos.get(slider) === undefined) {
      lastScrollPos.set(slider, {
        time: now,
        position: scrollElem.scrollLeft,
        touchPosition,
      });
    }

    window.clearTimeout(swipeTimeout);
    swipeTimeout = window.setTimeout(() => {
      swipeDirection.delete(slider);
      manipulatedSlider = undefined;
      momentumScroll(slider);
    }, 100);
  });

  window.park.eventHub.register('resize', window, () => {
    const sliders = window.park.$('.park-gallery');

    sliders.forEach((slider) => {
      scrollDirection.set(slider, undefined);
      scrollSlider(slider, 'closest');
    });
  });

  window.park.eventHub.register('click', '.park-gallery__arrow-nav-button, .park-gallery__index-nav-item-button', (e) => {
    const elem = e.target;
    const slider = elem.closest('.park-gallery');

    if (elem.matches('.park-gallery__arrow-nav-prev-button')) {
      scrollSlider(slider, 'left');
    } else if (elem.matches('.park-gallery__arrow-nav-next-button')) {
      scrollSlider(slider, 'right');
    }
  });

  window.park.observer.initialize('.park-gallery', (slider) => {
    if (window.location.hash) {
      pauseTrackpageview = true;
      window.setTimeout(() => {
        pauseTrackpageview = false;
      }, 700);
      hashScroll();
    }

    window.setInterval(() => {
      const arrowPrev = slider.querySelector('.park-gallery__arrow-nav-prev');
      const arrowNext = slider.querySelector('.park-gallery__arrow-nav-next');

      if (arrowPrev) {
        arrowPrev.removeAttribute('aria-hidden');
      }

      if (arrowNext) {
        arrowNext.removeAttribute('aria-hidden');
      }

      if (!isVisible(slider)) {
        return;
      }
      adaptHeightToScrollPosition(slider);
    }, 1000);

    if (window.IntersectionObserver) {
      let adReloadDebounce;

      window.park.intersections.observe(slider, null, (result) => {
        if (result) {
          slider.classList.add('park-gallery--is-visible');
        } else {
          slider.classList.remove('park-gallery--is-visible');
        }
      });

      const callback = (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            adReloadDebounce = window.setTimeout(() => {
              const portalWrapper = slider.querySelector('.park-gallery__slides-portal');
              const displayValue = window.getComputedStyle(portalWrapper).getPropertyValue('display');

              if (displayValue !== 'block') {
                portalWrapper.style.display = 'block';
              } else {
                const containerId = slider
                  .querySelector('.park-gallery__slides-portal .park-portal')
                  .getAttribute('data-portal-id');

                window.park.eventHub.trigger(document, 'park.portal:reload', {
                  adSlotName: containerId,
                });
              }
            }, 100);
          } else {
            window.clearTimeout(adReloadDebounce);
          }
        });
      };

      const observer = new IntersectionObserver(callback, {
        root: slider,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.00001,
      });

      window.park.observer.initialize('.park-gallery__item--portal', (elem) => {
        if (!slider.contains(elem)) {
          return;
        }

        if (observedPortalSlides.has(elem)) {
          return;
        }

        console.log('FOUND a .park-gallery__item--portal');

        observedPortalSlides.add(elem);
        observer.observe(elem);
      }, false);
    }
  }, false);

  window.park.observer.initialize('.park-gallery__slides-portal .park-portal', (elem) => {
    function init() {
      const containerId = elem.getAttribute('data-portal-id');

      if (!containerId) {
        window.setTimeout(init, 100);
        return;
      }

      window.park.eventHub.trigger(document, 'park.portal:removefromreloadalllist', {
        adSlotName: containerId,
      });
    }

    init();
  }, false);

  window.addEventListener('hashchange', (e) => {
    if (window.location.hash) {
      hashScroll();
      return;
    }

    if (window.location.hash === '#0' && window.history) {
      window.history.replaceState('', document.title, window.location.pathname);
    }


    if (e.oldURL && e.oldURL.startsWith(e.newURL)) {
      hashScroll();
    }
  });

  window.park.eventHub.register('keyup', document, (e) => {
    const sliders = $('.park-gallery');
    const hoveredElems = $(':hover');

    if (!sliders.length) {
      return;
    }

    sliders.forEach((slider) => {
      // see if the user hovers over a slider
      hoveredElems.forEach((elem) => {
        const hoveredIndex = sliders.indexOf(elem);
        if (hoveredIndex !== -1) {
          slider = sliders[hoveredIndex];
        }
      });

      switch (e.keyCode) {
        default:
          break;

        case 37:
          scrollSlider(slider, 'left');
          e.preventDefault();
          break;

        case 39:
          scrollSlider(slider, 'right');
          e.preventDefault();
          break;
      }
    });
  });
})();
