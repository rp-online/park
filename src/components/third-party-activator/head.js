(() => {
  const $ = window.park.$;
  const prefix = 'park-third-party-activator';

  function activate(elem) {
    if (elem.classList.contains(`${prefix}--is-active`)) {
      return;
    }

    const content = elem.querySelector(`.${prefix}__content`);
    const html = content.textContent;
    const range = document.createRange();

    range.setStart(elem, 0);
    elem.appendChild(range.createContextualFragment(html));
    elem.classList.remove(`${prefix}--is-inactive`);
    elem.classList.add(`${prefix}--is-active`);
  }

  function deactivate(elem) {
    if (elem.classList.contains(`${prefix}--is-inactive`)) {
      return;
    }

    const elementsToRemove = $(`.${prefix} > *:not([class^="park-image"]):not([class^="park-third-party-activator"])`, elem);

    elementsToRemove.forEach((elemToRemove) => {
      elem.removeChild(elemToRemove);
    });

    $('.park-input__input', elem)[0].checked = false;
    elem.classList.remove(`${prefix}--is-active`);
    elem.classList.add(`${prefix}--is-inactive`);
  }

  function update(elem) {
    const name = elem.getAttribute('data-name').toLowerCase();

    if (window.park.thirdPartyManager.isActive(name)) {
      activate(elem);
    } else {
      deactivate(elem);
    }
  }

  window.park.observer.initialize(`.${prefix}`, (elem) => {
    document.addEventListener('park.user:authchange', () => {
      update(elem);
    });

    update(elem);
  });
})();
