(() => {
  window.park.eventHub.register('focus', '.park-input__input', (e) => {
    const input = e.target;
    const wrapper = e.target.closest('.park-input');

    if (input.type !== 'checkbox') {
      wrapper.classList.add('park-input--was-touched');
    }

    wrapper.classList.add('park-input--is-focused');

    if (input.checkValidity()) {
      wrapper.removeAttribute('data-validation-message');
    } else {
      wrapper.setAttribute('data-validation-message', input.validationMessage);
    }

    /* wrapper.removeAttribute('data-validation-message'); */
  });

  window.park.eventHub.register('blur', '.park-input__input', (e) => {
    const input = e.target;
    const wrapper = input.closest('.park-input');

    wrapper.classList.remove('park-input--is-focused');

    if (input.checkValidity()) {
      wrapper.removeAttribute('data-validation-message');
    } else {
      wrapper.setAttribute('data-validation-message', input.validationMessage);
    }
  });

  window.park.eventHub.register('input change', '.park-input__input', (e) => {
    const elem = e.target;
    const wrapper = elem.closest('.park-input');

    window.setTimeout(() => {
      wrapper.classList[elem.parkValue || elem.value ? 'add' : 'remove']('park-input--is-filled');
    });

    wrapper.classList.remove('park-input--is-focused');

    if (elem.checkValidity()) {
      wrapper.removeAttribute('data-validation-message');
    } else {
      wrapper.setAttribute('data-validation-message', elem.validationMessage);
    }
  });

  window.park.eventHub.register('click', '.park-input__password-toggle', (e) => {
    const elemId = e.target.getAttribute('aria-controls');
    const elem = document.getElementById(elemId);

    if (elem.type === 'password') {
      elem.type = 'text';
    } else {
      elem.type = 'password';
    }
  });

  /* Next: Search input specific behavior */
  window.park.eventHub.register('keydown', '.park-input__input[type="search"]', (e) => {
    if (e.key !== 'Escape' && e.key !== 'Esc') {
      return;
    }

    e.target.value = '';
  });
})();
