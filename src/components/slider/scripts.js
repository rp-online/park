(() => {
  const $ = window.park.$;
  const maxSlideDuration = 300;
  const lastScrollPos = window.WeakMap ? new WeakMap() : new Map();
  const scrollDirection = window.WeakMap ? new WeakMap() : new Map();
  const swipeDirection = window.WeakMap ? new WeakMap() : new Map();
  const animatedSliders = window.WeakSet ? new WeakSet() : new Set();
  let manipulatedSlider;

  function isVisible(slider) {
    if (window.IntersectionObserver) {
      return slider.classList.contains('park-slider--is-visible');
    }
    return window.park.visibility.isVisible(slider);
  }

  function adaptNavToScrollPosition(slider) {
    const sliderList = slider.querySelector('.park-slider__list');
    const sliderArrowNavPrevs = $('.park-slider__arrow-nav-prev', slider);
    const sliderArrowNavNexts = $('.park-slider__arrow-nav-next', slider);

    if (sliderList.scrollLeft < 10) {
      sliderArrowNavPrevs.forEach(elem => elem.setAttribute('aria-hidden', 'true'));
    } else {
      sliderArrowNavPrevs.forEach(elem => elem.removeAttribute('aria-hidden'));
    }

    if ((sliderList.scrollLeft + sliderList.offsetWidth) > (sliderList.scrollWidth - 20)) {
      sliderArrowNavNexts.forEach(elem => elem.setAttribute('aria-hidden', 'true'));
    } else {
      sliderArrowNavNexts.forEach(elem => elem.removeAttribute('aria-hidden'));
    }
  }

  function scrollSlider(slider, direction, autoforward) {
    const sliderList = slider.querySelector('.park-slider__list');
    const sliderItems = $('.park-slider__item', sliderList);

    if (!sliderItems.length) {
      return;
    }

    const sliderItemFirst = sliderItems[0];
    const sliderItemWidth = sliderItemFirst.offsetWidth;
    const sliderItemPositions = sliderItems.map(item => item.offsetLeft);
    const sliderWidth = slider.offsetWidth;
    let slideToIndex = 0;

    switch (direction) {
      default:
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
            (
              sliderList.scrollLeft -
              sliderWidth
            ) + (sliderItemWidth * 0.5)
        ) || sliderItemPositions[sliderItemPositions.length - 1];

        slideToIndex = sliderItemPositions.reverse().indexOf(pos);

        if (slideToIndex === -1) {
          slideToIndex = (sliderItemPositions.length - 1);
        }
        break;
      }

      case 'right':
        slideToIndex = sliderItemPositions.findIndex(
          pos => pos >
            (
              sliderList.scrollLeft +
              sliderWidth
            ) - (sliderItemWidth * 0.5)
        );

        if (slideToIndex === -1) {
          slideToIndex = 0;
        }
        break;
    }

    if (slideToIndex === -1) {
      slideToIndex = (sliderItemPositions.length - 1);
    }

    const slideToPos = (() => {
      const sliderItemPosition = slideToIndex === 0 ? 0 : sliderItemPositions[slideToIndex];

      if ((sliderItemPosition + sliderWidth) > sliderList.scrollWidth) {
        return (sliderList.scrollWidth - sliderWidth) + 100;
      }

      return Math.max(0, sliderItemPosition);
    })();

    const slideDuration = Math.min(
      maxSlideDuration,
      Math.abs(sliderList.scrollLeft - slideToPos) * 2
    );

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
      adaptNavToScrollPosition(slider);
      if (window.park.eventHub && !autoforward) {
        window.park.eventHub.trigger(document, 'park.slider:slided', {
          elem: slider,
          targetSlide: slideToIndex,
        });
      }
    });
  }

  function momentumScroll(slider) {
    if ('scroll-snap-align' in document.documentElement.style) {
      if (window.park.eventHub) {
        window.park.eventHub.trigger(document, 'park.slider:slided', {
          elem: slider,
          targetSlide: -1, // Target slide is not easily determined
        });
      }

      return;
    }

    if (manipulatedSlider === slider) {
      return;
    }

    if (animatedSliders.has(slider)) {
      return;
    }

    const scrollElem = slider.querySelector('.park-slider__list');
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
    const slider = e.target.closest('.park-slider');

    if (!slider) {
      return;
    }

    manipulatedSlider = slider;

    const scrollElem = slider.querySelector('.park-slider__list');
    const now = (new Date()).getTime();
    const touchPosition = e.touches[0].pageX;

    lastScrollPos.set(slider, {
      time: now,
      position: scrollElem.scrollLeft,
      touchPosition,
    });
  });

  document.addEventListener('touchmove', (e) => {
    const slider = e.target.closest('.park-slider');

    if (!slider) {
      return;
    }

    const lastScrollPosition = lastScrollPos.get(slider);
    const scrollElem = slider.querySelector('.park-slider__list');
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
    const slider = e.target.closest('.park-slider');

    if (!slider) {
      return;
    }
    swipeDirection.delete(slider);
    manipulatedSlider = undefined;

    momentumScroll(slider);
  });

  document.addEventListener('load', (e) => {
    const slider = e.target.closest('.park-slider');

    if (!slider) {
      return;
    }

    adaptNavToScrollPosition(slider);
  }, true);

  const scrollSnapSupport = 'scroll-snap-align' in document.documentElement.style;
  if (!scrollSnapSupport) {
    window.park.eventHub.register('resize', window, () => {
      const sliders = window.park.$('.park-slider');

      sliders.forEach((slider) => {
        scrollDirection.set(slider, undefined);
        scrollSlider(slider, 'closest');
      });
    });
  }

  window.park.eventHub.register('click', '.park-slider__arrow-nav-button', (e) => {
    const elem = e.target;
    const slider = elem.closest('.park-slider');

    if (elem.matches('.park-slider__arrow-nav-prev-button')) {
      scrollSlider(slider, 'left');
    } else if (elem.matches('.park-slider__arrow-nav-next-button')) {
      scrollSlider(slider, 'right');
    }
  });

  window.park.observer.initialize('.park-slider', (slider) => {
    if (window.IntersectionObserver) {
      window.park.intersections.observe(slider, null, (result) => {
        if (result) {
          slider.classList.add('park-slider--is-visible');
        } else {
          slider.classList.remove('park-slider--is-visible');
        }
      });
    }

    window.setInterval(() => {
      if (!isVisible(slider)) {
        return;
      }

      adaptNavToScrollPosition(slider);
    }, 300);

    adaptNavToScrollPosition(slider);

    if (slider.matches('.park-slider--autoforward')) {
      window.setInterval(() => {
        if (
          !slider.matches('.park-slider:hover') &&
          !slider.querySelector('.park-slider__list').contains(document.activeElement)
        ) {
          scrollSlider(slider, 'right', true);
        }
      }, 6000);
    }
  });

  window.park.eventHub.register('keyup', document, (e) => {
    const sliders = $('.park-slider').filter(slider => isVisible(slider));
    const hoveredElems = $(':hover');

    if (!sliders.length) {
      return;
    }

    let slider = sliders[0]; // apply to the first visible slider

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
})();
