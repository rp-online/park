(() => {
  const $ = window.park.$;
  const timeOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const initializedElems = window.WeakSet ? new WeakSet() : new Set();
  let offset = 0;
  let order = 'asc';

  function fetchComments(comments) {
    if (!comments.getAttribute('data-comments-url')) {
      return;
    }

    const url = `${window.park.exports.config.rootBase}${comments.getAttribute('data-comments-url')}`;
    const template = comments.querySelector('template');
    const content = template.content || template;
    const list = comments.querySelector('.park-comments__comments');
    const button = comments.querySelector('.park-button');
    const templateItem = content.querySelector('.park-comments__comment');
    const templateItemHtml = templateItem.innerHTML;
    const fragment = document.createDocumentFragment();

    button.classList.add('park-button--is-loading');
    list.style.height = `${list.scrollHeight}px`;

    window.park.ajax(`${url}&offset=${offset}&limit=11&order=${order}`)
      .then(result => result.json())
      .then((result) => {
        result.slice(0, 10).forEach((comment) => {
          const elem = document.createElement(templateItem.nodeName.toLowerCase());
          const date = new Date(comment.time * 1000);
          let time = date.toLocaleString();

          elem.className = templateItem.className;
          elem.id = comment.id;
          elem.innerHTML = templateItemHtml;
          elem.querySelector('.park-comments__comment-text').innerText = comment.text;
          elem.querySelector('.park-comments__comment-user').textContent = comment.user;

          try {
            time = date.toLocaleString('de-DE', timeOptions);
          } catch (e) {
            time = date.toLocaleString();
          }

          elem.querySelector('.park-comments__comment-link').href = `#${comment.id}`;
          elem.querySelector('.park-comments__comment-time').textContent = `${time} Uhr`;

          fragment.appendChild(elem);
        });

        list.appendChild(fragment);
        list.style.height = `${list.scrollHeight}px`;
        button.classList.remove('park-button--is-loading');
        comments.classList.add('park-comments--is-visible');

        setTimeout(() => {
          list.style.height = 'auto';
        }, 3000);

        if (result.length === 0) {
          comments.querySelector('.park-comments__wrapper').classList.add('park-comments--is-not-visible');
        } else if (result.length > 0) {
          comments.querySelector('.park-comments__wrapper').classList.remove('park-comments--is-not-visible');
        }
        if (result.length < 11) {
          comments.classList.add('park-comments--is-complete');
        }
      })
      .catch((e) => {
        window.park.console.log(e);
      });
  }

  window.park.eventHub.register('change', '.park-comments .park-select__select', (e) => {
    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.comments:sort', {
        elem: e.target.closest('.park-comments'),
      });
    }

    const select = e.target;
    const optionValues = $('option', select).map(option => option.value);
    const comments = select.closest('.park-comments');
    const list = comments.querySelector('.park-comments__comments');

    comments.classList.remove('park-comments--is-visible');
    list.innerHTML = '';
    list.style.height = '0';

    let commentsClassName = comments.className;

    optionValues.forEach((value) => {
      commentsClassName = commentsClassName.replace(`park-comments--sorting-${value}`, '');
    });

    comments.className = `${commentsClassName} park-comments--sorting-${select.value}`;
    order = (select.value === 'date+') ? 'asc' : 'desc';
    offset = 0;
    fetchComments(comments);
  });

  window.park.eventHub.register('click', '.park-comments__wrapper .park-button', (e) => {
    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.comments:more', {
        elem: e.target.closest('.park-comments'),
      });
    }

    offset += 10;

    const button = e.target;
    const comments = button.closest('.park-comments');

    fetchComments(comments);
  });

  window.park.eventHub.register('submit', '.park-comments-form .park-form', (e) => {
    const form = e.target;
    const text = form.querySelector('.park-textarea__textarea').value;
    const notifyme = form.querySelector('[name=notify_me]').checked;
    const beitragid = form.closest('.park-comments').getAttribute('data-comments-id');
    const button = form.querySelector('[type="submit"]');

    if (text.length) {
      if (button) {
        button.disabled = true;
      }

      const data = new FormData();
      data.append('beitrag_id', beitragid);
      data.append('notifyme', notifyme);
      data.append('text', text);
      window.park.storage.set(`park.comment.${beitragid}`, text);
      window.park.api.createComment(data).then((result) => {
        if (result.errors) {
          document.querySelector('.park-comments-form__error').removeAttribute('aria-hidden');
          document.querySelector('.park-comments-form__error .park-comments-form__paragraph').textContent = result.errors;
          if (button) {
            button.disabled = false;
          }
        } else {
          document.querySelector('.park-comments-form__success').removeAttribute('aria-hidden');
          form.setAttribute('aria-hidden', 'true');
          window.park.storage.remove(`park.comment.${beitragid}`);
        }
      });
      const comments = form.closest('.park-comments');
      comments.querySelector('.park-comments-form__default').setAttribute('aria-hidden', 'true');
    }

    e.preventDefault();
  });

  function updateForm(comments) {
    if (!comments || !comments.querySelector) {
      return;
    }

    const form = comments.querySelector('.park-comments-form form');
    const formDefault = comments.querySelector('.park-comments-form__default');
    const formSuspended = comments.querySelector('.park-comments-form__suspended');
    const formUnauthorized = comments.querySelector('.park-comments-form__unauthorized');

    try {
      const beitragid = form.closest('.park-comments').getAttribute('data-comments-id');
      const textArea = form.querySelector('.park-textarea__textarea');
      const previousValue = window.park.storage.get(`park.comment.${beitragid}`);

      if (!textArea.value && previousValue) {
        textArea.value = previousValue;
      }
    } catch (e) {
      window.park.console.error('Error prefilling a previouly entered value');
    }

    if (window.park.user.isLoggedIn()) {
      window.park.user.getUser().then((user) => {
        if (user && user.suspended === true) {
          if (form) {
            form.setAttribute('aria-hidden', 'true');
          }
          if (formDefault) {
            formDefault.setAttribute('aria-hidden', 'true');
          }
          if (formSuspended) {
            formSuspended.removeAttribute('aria-hidden');
          }
        } else {
          if (form) {
            form.removeAttribute('aria-hidden');
          }
          if (formDefault) {
            formDefault.removeAttribute('aria-hidden');
          }
          if (formSuspended) {
            formSuspended.setAttribute('aria-hidden', 'true');
          }
        }
        if (formUnauthorized) {
          formUnauthorized.setAttribute('aria-hidden', 'true');
        }
      });
    } else {
      if (form) {
        form.setAttribute('aria-hidden', 'true');
      }
      if (formDefault) {
        formDefault.removeAttribute('aria-hidden');
      }
      if (formSuspended) {
        formSuspended.setAttribute('aria-hidden', 'true');
      }
      if (formUnauthorized) {
        formUnauthorized.removeAttribute('aria-hidden');
      }
    }
  }

  window.park.observer.initialize('.park-comments', (comments) => {
    if (initializedElems.has(comments)) {
      window.park.console.log('Comments section already initialized');
      return;
    }

    initializedElems.add(comments);

    if (!comments.querySelector('.park-comments-form--disabled')) {
      document.addEventListener('park.user:authchange', () => {
        updateForm(comments);
      });

      updateForm(comments);
    }

    fetchComments(comments);
  }, false);
})();
