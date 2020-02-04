(() => {
  function checkValidity(select, wrapper) {
    if (select.checkValidity) {
      if (select.checkValidity()) {
        wrapper.removeAttribute('data-validation-message');
      } else {
        wrapper.setAttribute('data-validation-message', select.validationMessage);
      }
    }
  }

  function search(input) {
    const searchTerm = input.textContent.trim().toLowerCase();
    const wrapper = input.closest('.park-select');
    const hiddenInput = wrapper.querySelector('.park-select__multiple-hidden-input');
    const list = wrapper.querySelector('.park-select__multiple-list');
    const items = [].slice.call(list.children);
    const filteredItems = items.filter((item) => {
      const value = item.getAttribute('data-value');
      const selectedValues = [].slice.call(hiddenInput.options)
        .filter(option => option.selected)
        .map(option => option.value);

      if (selectedValues.indexOf(value) !== -1) {
        item.style.display = 'none';
        return false;
      }

      if (searchTerm) {
        if (!item.textContent.trim().toLowerCase().startsWith(searchTerm)) {
          item.style.display = 'none';
          return false;
        }

        item.style.display = 'block';
      } else {
        item.style.display = '';
      }
      return true;
    });

    if (!filteredItems.length) {
      list.classList.add('park-select__multiple-list--is-empty');
    } else {
      list.classList.remove('park-select__multiple-list--is-empty');
    }
  }

  function collapseAllLists() {
    window.park.$('.park-select__multiple-toggle').forEach((button) => {
      const targetId = button.getAttribute('aria-controls');
      const target = document.getElementById(targetId);

      button.setAttribute('aria-expanded', 'false');
      target.setAttribute('aria-hidden', 'true');
    });
  }

  function renderSelectedTags(input, noFocus) {
    const range = document.createRange();
    const sel = window.getSelection();
    const wrapper = input.closest('.park-select');
    const inputContainer = wrapper.querySelector('.park-select__multiple-input');
    const hiddenInput = wrapper.querySelector('.park-select__multiple-hidden-input');
    const selectedOptions = [].slice.call(hiddenInput.options)
      .filter(option => option.selected);
    const tags = window.park.$('.park-select__multiple-tag', inputContainer);

    tags.forEach((tag) => {
      inputContainer.removeChild(tag);
    });

    selectedOptions.forEach((option) => {
      const tag = document.createElement('b');

      tag.className = 'park-select__multiple-tag';
      tag.setAttribute('data-value', option.value);
      tag.innerHTML = `${option.label}<button class="park-select__multiple-tag-remove">Entfernen</button>`;

      inputContainer.insertBefore(tag, input);
    });

    if (wrapper.hasAttribute('data-max')) {
      const max = parseInt(wrapper.getAttribute('data-max'), 10);

      if (selectedOptions.length >= max) {
        wrapper.classList.add('park-select--maxed-out');
        return;
      }
    }

    wrapper.classList.remove('park-select--maxed-out');
    input.textContent = '';

    if (noFocus) {
      return;
    }

    input.focus();

    if (input.textContent) {
      range.setStart(input.childNodes[0], input.textContent.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    search(input);
  }

  function changeOption(input, value, selected) {
    const wrapper = input.closest('.park-select');
    const hiddenInput = wrapper.querySelector('.park-select__multiple-hidden-input');
    const option = hiddenInput.querySelector(`option[value="${value}"]`);

    if (option) {
      if (selected) {
        const elem = hiddenInput.removeChild(option);
        const firstUnselected = hiddenInput.querySelector('option:not([selected])');

        if (firstUnselected) {
          hiddenInput.insertBefore(elem, firstUnselected);
        } else {
          hiddenInput.appendChild(elem);
        }
        elem.setAttribute('selected', '');
      } else {
        option.setAttribute('selected', 'selected');
        option.removeAttribute('selected');
      }
    }

    window.park.eventHub.trigger(hiddenInput, 'input');
    window.park.eventHub.trigger(hiddenInput, 'change');

    renderSelectedTags(input);
  }

  function removeLastTag(input) {
    const wrapper = input.closest('.park-select');
    const tags = window.park.$('.park-select__multiple-tag', wrapper);
    const lastTag = tags.pop();
    const value = lastTag.getAttribute('data-value');

    changeOption(input, value, false);
  }

  window.park.eventHub.register('ontouchstart' in window ? 'touchstart' : 'click', '.park-select__multiple-tag-remove', (e) => {
    const tag = e.target.closest('.park-select__multiple-tag');
    const wrapper = tag.closest('.park-select');
    const input = wrapper.querySelector('.park-select__multiple-editor');
    const value = tag.getAttribute('data-value');

    changeOption(input, value, false);

    e.preventDefault();
  });

  window.park.eventHub.register('focus', '.park-select__select, .park-select__multiple-editor', (e) => {
    const wrapper = e.target.closest('.park-select');

    wrapper.classList.add('park-select--was-touched');
    wrapper.classList.add('park-select--is-focused');
  });

  window.park.eventHub.register('blur', '.park-select__select, .park-select__multiple-editor', (e) => {
    const wrapper = e.target.closest('.park-select');
    const select = wrapper.querySelector('select');

    wrapper.classList.remove('park-select--is-focused');

    checkValidity(select, wrapper);
  });

  window.park.eventHub.register('change', '.park-select__select, .park-select__multiple-hidden-input', (e) => {
    const wrapper = e.target.closest('.park-select');
    const select = wrapper.querySelector('select');

    checkValidity(select, wrapper);
  });

  window.park.eventHub.register('keyup', '.park-select__multiple-editor', (e) => {
    switch (e.key) {
      default:
        break;

      case 'Backspace':
      case 'Enter':
      case 'Escape':
        return;
    }

    const input = e.target;
    const wrapper = input.closest('.park-select');
    const button = wrapper.querySelector('.park-select__multiple-toggle');
    const targetId = button.getAttribute('aria-controls');
    const target = document.getElementById(targetId);

    button.setAttribute('aria-expanded', 'true');
    target.setAttribute('aria-hidden', 'false');
    search(input);
  });

  window.park.eventHub.register('focus', '.park-select__multiple-editor', (e) => {
    const input = e.target;
    const wrapper = input.closest('.park-select');
    const button = wrapper.querySelector('.park-select__multiple-toggle');
    const targetId = button.getAttribute('aria-controls');
    const target = document.getElementById(targetId);

    button.setAttribute('aria-expanded', 'false');
    target.setAttribute('aria-hidden', 'true');
  });

  // The following closes all open multiples
  window.park.eventHub.register('click', document, (e) => {
    if (e.target.matches('.park-select__multiple-toggle')) {
      return;
    }

    window.setTimeout(() => {
      collapseAllLists();
    });
  }, true);

  window.park.eventHub.register('blur', document, (e) => {
    if (e.target && e.target.closest && e.target.closest('.park-select--multiple')) {
      return;
    }

    collapseAllLists();
  }, true);

  window.park.eventHub.register('keydown', document, (e) => {
    if (e.key !== 'Escape' && e.key !== 'Esc') {
      return;
    }

    collapseAllLists();

    if (e.target.closest('.park-select--multiple')) {
      const wrapper = e.target.closest('.park-select');
      const input = wrapper.querySelector('.park-select__multiple-editor');

      input.textContent = '';
      input.focus();
    }
  }, true);
  // End

  window.park.eventHub.register('keydown', '.park-select__multiple-editor', (e) => {
    const input = e.target;
    const wrapper = input.closest('.park-select');
    const button = wrapper.querySelector('.park-select__multiple-toggle');
    const list = wrapper.querySelector('.park-select__multiple-list');
    const items = [].slice.call(list.children);
    const filteredItems = items.filter(item => item.style.display !== 'none');

    switch (e.key) {
      default:
        break;

      case 'Enter':
        if (filteredItems.length) {
          window.setTimeout(() => {
            changeOption(input, filteredItems[0].getAttribute('data-value'), true);
          });
        }

        input.textContent = '';
        search(input);
        button.setAttribute('aria-expanded', 'false');
        list.setAttribute('aria-hidden', 'true');
        e.preventDefault();
        break;

      case 'Down':
      case 'ArrowDown':
        search(input);
        button.setAttribute('aria-expanded', 'true');
        list.setAttribute('aria-hidden', 'false');
        break;

      case 'Backspace':
        search(input);
        button.setAttribute('aria-expanded', 'false');
        list.setAttribute('aria-hidden', 'true');

        if (!input.textContent) {
          removeLastTag(input);
        }
        break;
    }
  });

  /* The following allows for cursor navigation in between all currently visible menu items */
  window.park.navigationHelper.enableArrowNav('.park-select--multiple', '.park-select__label, .park-select__multiple-toggle, .park-select__multiple-tag-remove');

  const touchStarted = window.WeakSet ? new WeakSet() : new Set();

  /* The following is a fix for the following iOS Safari bug: https://www.quirksmode.org/blog/archives/2010/09/click_event_del.html */
  window.park.eventHub.register('touchstart', '.park-select__multiple-listitem', (e) => {
    touchStarted.add(e.target);
  });

  window.park.eventHub.register('touchmove', '.park-select__multiple-listitem', (e) => {
    touchStarted.delete(e.target);
  });

  window.park.eventHub.register('touchend', '.park-select__multiple-listitem', (e) => {
    if (touchStarted.has(e.target)) {
      touchStarted.delete(e.target);
      e.target.click();
    }
  });

  window.park.eventHub.register('click keydown mousedown', '.park-select__multiple-listitem', (e) => {
    if (['click', 'mousedown', 'keydown'].indexOf(e.type) === -1 || (e.type === 'keydown' && e.key !== 'Enter')) {
      return;
    }

    const wrapper = e.target.closest('.park-select');
    const input = wrapper.querySelector('.park-select__multiple-editor');
    const button = wrapper.querySelector('.park-select__multiple-toggle');
    const list = wrapper.querySelector('.park-select__multiple-list');

    button.setAttribute('aria-expanded', 'false');
    list.setAttribute('aria-hidden', 'true');

    window.setTimeout(() => {
      changeOption(input, e.target.getAttribute('data-value'), true);
    });
    input.textContent = '';
    search(input);

    e.preventDefault();
    e.stopImmediatePropagation();
  });

  window.park.observer.initialize('.park-select__multiple-editor', (input) => {
    search(input);
    renderSelectedTags(input, true);
  }, false);
})();
