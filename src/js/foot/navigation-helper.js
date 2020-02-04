(() => {
  const focusableElems = [
    'iframe',
    'input',
    'select',
    'textarea',
    'button',
    'a',
    '[contenteditable]',
    '[tabindex]:not([tabindex="-1"])',
  ];

  function toggleCaptureNav(elem, action) {
    const parkIframesAndFocusableChildren = window.park.$(`.park-iframe,${focusableElems.join(',')}`, elem);
    const focusableChildren = window.park.$(focusableElems.join(','), elem);
    const focusableVisibleChildren = focusableChildren
      .filter(elem => window.getComputedStyle(elem, null).getPropertyValue('display') !== 'none');

    if (parkIframesAndFocusableChildren.length && parkIframesAndFocusableChildren[0].matches('.park-iframe')) {
      return;
    }

    if (focusableChildren.length && focusableChildren[0].matches('iframe')) {
      return;
    }

    function captureNavWithinHandler(e) {
      const previousFocusedElem = e.target;
      const nextFocusedElem = e.relatedTarget;

      if (focusableVisibleChildren.indexOf(nextFocusedElem) === -1) {
        window.setTimeout(() => {
          let newTargetElem;

          if (focusableVisibleChildren.indexOf(previousFocusedElem) === 0) {
            newTargetElem = focusableVisibleChildren[focusableVisibleChildren.length - 1];
          } else {
            newTargetElem = focusableVisibleChildren[0];
          }

          newTargetElem.focus();
          newTargetElem.classList.add('focus-ring');
          newTargetElem.setAttribute('data-focus-ring-added', '');
        });
      }
    }

    if (action === 'off') {
      window.removeEventListener('focusout', captureNavWithinHandler, true);
    } else {
      (focusableChildren[0] || elem).focus();
      window.addEventListener('focusout', captureNavWithinHandler, true);
    }
  }

  window.park = Object.assign({}, window.park, {
    navigationHelper: {
      captureNav: (elem) => {
        toggleCaptureNav(elem, 'on');
      },
      releaseNav: (elem) => {
        toggleCaptureNav(elem, 'off');
      },
      enableArrowNav: (selector, excludeSelector) => {
        window.park.eventHub.register('keydown', `${selector} *`, (e) => {
          const focusableChildren = window.park.$(focusableElems
            .map(subSelector => `${selector} ${subSelector}`).join(','));

          if (focusableChildren.indexOf(document.activeElement) === -1) {
            focusableChildren.push(document.activeElement);
          }

          const focusableVisibleChildren = focusableChildren
            .filter(elem => window.getComputedStyle(elem, null).getPropertyValue('display') !== 'none');
          const focusedChildIndex = focusableVisibleChildren
            .findIndex(elem => elem === document.activeElement);
          let newIndex = 0;

          if (focusedChildIndex === -1) {
            return;
          }

          const focusableFilteredChildren = focusableVisibleChildren
            .filter(elem => !elem.matches(excludeSelector));

          if (focusableFilteredChildren.length <= 1) {
            return;
          }

          const startTime = (new Date()).getTime();

          switch (e.key) {
            case 'Down':
            case 'ArrowDown':
              newIndex = focusedChildIndex;

              do {
                newIndex += 1;

                if (newIndex === focusableVisibleChildren.length) {
                  newIndex = focusableVisibleChildren.length - 1;
                }
              } while (
                focusableVisibleChildren[newIndex].matches(excludeSelector) &&
                (new Date()).getTime() < (startTime + 50)
                );

              focusableVisibleChildren[newIndex].focus();
              focusableVisibleChildren[newIndex].classList.add('focus-ring');
              focusableVisibleChildren[newIndex].setAttribute('data-focus-ring-added', '');

              e.preventDefault();
              e.stopImmediatePropagation();
              break;

            case 'Up':
            case 'ArrowUp':
              newIndex = focusedChildIndex;

              do {
                newIndex -= 1;

                if (newIndex === -1) {
                  newIndex = 0;
                }
              } while (
                focusableVisibleChildren[newIndex].matches(excludeSelector) &&
                (new Date()).getTime() < (startTime + 50)
                );

              focusableVisibleChildren[newIndex].focus();
              focusableVisibleChildren[newIndex].classList.add('focus-ring');
              focusableVisibleChildren[newIndex].setAttribute('data-focus-ring-added', '');

              e.preventDefault();
              e.stopImmediatePropagation();
              break;

            default:
              break;
          }
        });
      },
    },
  });
})();
