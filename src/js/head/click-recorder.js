(() => {
  const clickStack = [];
  const touchStartStack = [];

  function touchStartOn(el, x = 0, y = 0) {
    let e;

    try {
      e = document.createEvent('TouchEvent');
      e.initTouchEvent('touchstart', true, true);
    } catch (err) {
      try {
        e = document.createEvent('UIEvent');
        e.initUIEvent('touchstart', true, true);
      } catch (err) {
        e = document.createEvent('Event');
        e.initEvent('touchstart', true, true);
      }
    }
    e.targetTouches = {
      pageX: x,
      pageY: y,
    };
    el.dispatchEvent(e);
  }

  function recordClick(e) {
    if (window.park.eventHub) {
      return;
    }

    if (clickStack.indexOf(e.target) === -1) {
      clickStack.push(e.target);

      if (e.target.closest('a').hasAttribute('href') && e.target.closest('a').getAttribute('href').substr(0, 1) === '#') {
        e.preventDefault();
      }
    }
  }

  function recordTouchStart(e) {
    if (window.park.eventHub) {
      return;
    }

    if (touchStartStack.indexOf(e.target) === -1) {
      touchStartStack.push(e.target);
    }
  }

  const interval = window.setInterval(() => {
    if (window.park.eventHub) {
      window.clearTimeout(interval);

      if ('ontouchstart' in window) {
        document.removeEventListener('touchstart', recordTouchStart, true);

        while (touchStartStack.length) {
          const elem = touchStartStack.shift();

          touchStartOn(elem, 0, 0);
        }
      }

      document.removeEventListener('click', recordClick, true);

      while (clickStack.length) {
        const elem = clickStack.shift();

        elem.click();
      }
    }
  }, 100);

  document.addEventListener('click', recordClick, true);

  if ('ontouchstart' in window) {
    document.addEventListener('touchstart', recordTouchStart, true);
  }
})();
