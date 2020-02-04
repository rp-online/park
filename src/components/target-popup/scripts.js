(() => {
  window.park.eventHub.register('click', 'a[target="popup"]', (e) => {
    const elem = e.target.closest('a');
    const height = elem.getAttribute('data-height') || 500;
    const href = elem.href;

    window.open(href, 'Popup', `width=400,height=${height},menubar=no`);

    e.preventDefault();
  });
})();
