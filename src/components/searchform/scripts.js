(() => {
  window.park.eventHub.register('reset', '.park-searchform', (e) => {
    const input = e.target.querySelector('.park-input__input');

    window.park.eventHub.trigger(input, 'change');

    input.focus();
  });

  window.park.eventHub.register('keydown', '.park-searchform > .park-input > .park-input__input', (e) => {
    const input = e.target;

    if (e.key !== 'Escape' && e.key !== 'Esc') {
      return;
    }

    input.value = '';

    window.park.eventHub.trigger(input, 'change');
  });
})();
