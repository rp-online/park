(() => {
  window.park.eventHub.register('focus', '.park-textarea__textarea', (e) => {
    const wrapper = e.target.closest('.park-textarea');

    wrapper.classList.add('park-textarea--was-touched');
    wrapper.classList.add('park-textarea--is-focused');
  });

  window.park.eventHub.register('blur', '.park-textarea__textarea', (e) => {
    const textarea = e.target;
    const wrapper = textarea.closest('.park-textarea');

    wrapper.classList.remove('park-textarea--is-focused');

    if (textarea.checkValidity) {
      if (textarea.checkValidity()) {
        wrapper.removeAttribute('data-validation-message');
      } else {
        wrapper.setAttribute('data-validation-message', textarea.validationMessage);
      }
    }
  });
})();
