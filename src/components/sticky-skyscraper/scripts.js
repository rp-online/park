(() => {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];

  window.googletag.cmd.push(() => {
    window.googletag.pubads().addEventListener('slotRenderEnded', (e) => {
      const slot = e.slot;
      const slotId = slot.getSlotElementId();
      const slotElem = document.getElementById(slotId);
      const creativeId = e.creativeId;

      if (
        !creativeId &&
        slotId === 'skyscraper' &&
        slotElem
      ) {
        slotElem.classList.add('park-sticky-skyscraper');
      }
    });
  });
})();
