(() => {
  document.addEventListener('park.menu-manager:open', (e) => {
    const elem = e.detail.elem;
    const id = elem.id;

    window.park.$(`.park-header [aria-controls][aria-expanded="true"]:not([aria-controls="${id}"]):not(.park-snackbar__close)`).forEach((elem) => {
      elem.click();
    });
  });
})();
