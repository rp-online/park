(() => {
  let elem;
  let startWidth;
  let startHeight;
  let startCoords;
  let offset;
  let vertical = false;

  function update() {
    if (elem) {
      if (!vertical) {
        elem.style.width = `${Math.max(0, startWidth - offset.x)}px`;
      } else {
        elem.style.height = `${Math.max(0, startHeight - offset.y)}px`;
      }
    }
  }

  function handleMousemove(e) {
    if (elem) {
      offset = {
        x: e.screenX - startCoords.x,
        y: e.screenY - startCoords.y,
      };

      window.requestAnimationFrame(update);

      e.preventDefault();
    }
  }

  window.park.eventHub.register('mousedown', '.park-image-comparison__resizable', (e) => {
    elem = e.target;
    startWidth = elem.offsetWidth;
    startHeight = elem.offsetHeight;
    startCoords = {
      x: e.screenX,
      y: e.screenY,
    };
    vertical = elem.matches('.park-image-comparison--vertical .park-image-comparison__resizable');

    document.addEventListener('mousemove', handleMousemove, true);

    e.preventDefault();
  });

  window.park.eventHub.register('mouseup', document, (e) => {
    elem = undefined;
    startWidth = undefined;
    startHeight = undefined;
    startCoords = undefined;
    offset = undefined;
    vertical = false;

    document.removeEventListener('mousemove', handleMousemove, true);

    e.preventDefault();
  });
})();

