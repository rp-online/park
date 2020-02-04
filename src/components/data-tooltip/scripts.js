window.park.observer.initialize('[data-tooltip]', (elem) => {
  const pseudoBeforeContent = window.getComputedStyle(elem, '::before')
    .getPropertyValue('content');

  if (pseudoBeforeContent === 'none') {
    elem.classList.add('park-data-tooltip--use-before-pseudo');
  }

  const pseudoAfterContent = window.getComputedStyle(elem, '::after')
        .getPropertyValue('content');

  if (pseudoAfterContent === 'none') {
    elem.classList.add('park-data-tooltip--use-after-pseudo');
  }
});
