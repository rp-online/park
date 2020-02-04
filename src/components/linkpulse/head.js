(() => {
  const linkpulseSelectors = [
    '.park-opener',
    '.park-teaser:not(.park-teaser--sugardaddy)',
    '.park-teaser-list',
    '.park-teaser-image-list',
    '.park-slider:not(.park-slider--twitter-tweet):not(.park-slider--kalaydo):not(.park-slider--weather)',
    '.park-figure--is-link',
    '.park-tab-container--teaser-list-item',
  ];
  const adsSelectors = [
    '.is-advertorial',
    '.park-portal',
    '.park-portal-marker',
  ];
  const linkpulseSelector = linkpulseSelectors.map(selector => `.park-section[data-linkpulse-group] ${selector}`).join(',');
  const adsSelector = adsSelectors.join(',');
  let currentIndex = 0;

  window.park.observer.initialize(linkpulseSelector, (elem) => {
    if (elem.closest(adsSelector)) {
      return;
    }

    currentIndex += 1;

    const section = elem.closest('.park-section[data-linkpulse-group]');
    const linkpulseGroup = section.getAttribute('data-linkpulse-group').replace('lp_', '');
    const linkpulseId = `lp_${linkpulseGroup}${(currentIndex)}`;

    elem.classList.add(linkpulseId.replace(/\s/g, '\u2009'));
    elem.setAttribute('data-linkpulse-id', linkpulseId);
  }, false);
})();
