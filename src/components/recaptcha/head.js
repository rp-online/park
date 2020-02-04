(() => {
  document.addEventListener('submit', (e) => {
    console.log('recaptcha submit');

    const form = e.target.closest('.park-form');

    if (!form) {
      console.error('recaptcha no form');
      return;
    }

    const recaptchaElem = form.querySelector('.park-recaptcha');

    if (!recaptchaElem) {
      console.error('recaptcha no .park-recaptcha');
      return;
    }

    const recaptchaResponseAttr = form.querySelector('[g-response]');

    if (recaptchaResponseAttr) {
      console.info('Response already given');
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

      console.log('recaptcha loadCallback');

      const allRecaptchaElems = window.park.$('.park-recaptcha');
      const recaptchaElemIndex = allRecaptchaElems.findIndex(elem => elem === recaptchaElem);

      console.log({ recaptchaElemIndex });

      try {
        window.grecaptcha.reset(recaptchaElemIndex);
      } catch (e) {
        console.log(e);
      }
      window.grecaptcha.render(form.querySelector('.g-recaptcha'), {
        callback: (recaptchaResponse) => {
          console.log({ recaptchaResponse });
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
