(() => {
  window.park.eventHub.register('submit', '.park-form', (e) => {
    window.setTimeout(() => {
      const form = e.target;

      window.park.$('[type="submit"]', form).forEach((elem) => {
        elem.disabled = true;
      });
    }, 100);
  });
})();
