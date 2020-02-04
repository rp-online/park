(() => {
  window.park.observer.initialize('p a:not(.park-richtext-image-link)', (link) => {
    if (link.querySelector('img')) {
      link.classList.add('park-richtext-image-link');
    }
  });
})();
