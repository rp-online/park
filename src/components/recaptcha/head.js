(() => {
  document.addEventListener('submit', (e) => {
    window.park.console.log('recaptcha submit');

    const form = e.target.closest('.park-form');

    if (!form) {
      window.park.console.error('recaptcha no form');
      return;
    }

    const recaptchaElem = form.querySelector('.park-recaptcha');

    if (!recaptchaElem) {
      window.park.console.error('recaptcha no .park-recaptcha');
      return;
    }

    const recaptchaResponseAttr = form.querySelector('[g-response]');

    if (recaptchaResponseAttr) {
      window.park.console.info('Response already given');
      return;
    }

    const loadCallback = function loadCallback() {
      if (
        !window.grecaptcha ||
        !window.grecaptcha.reset ||
        !window.grecaptcha.render ||
        !window.grecaptcha.execute
      ) {
        window.setTimeout(loadCallback, 100);
        return;
      }

      window.park.console.log('recaptcha loadCallback');

      const allRecaptchaElems = window.park.$('.park-recaptcha');
      const recaptchaElemIndex = allRecaptchaElems.findIndex(elem => elem === recaptchaElem);

      window.park.console.log({ recaptchaElemIndex });

      try {
        window.grecaptcha.reset(recaptchaElemIndex);
      } catch (e) {
        window.park.console.log(e);
      }
      window.grecaptcha.render(form.querySelector('.g-recaptcha'), {
        callback: (recaptchaResponse) => {
          window.park.console.log({ recaptchaResponse });
          recaptchaElem.setAttribute('g-response', recaptchaResponse);
          form.querySelector('[type="submit"]').click();
        },
      });
      window.grecaptcha.execute(recaptchaElemIndex);
    };

    window.park.resourceLoader.script('https://www.google.com/recaptcha/api.js?render=explicit', loadCallback);

    e.preventDefault();
    e.stopImmediatePropagation();
  }, true);
})();
