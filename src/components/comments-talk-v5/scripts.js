/* global Coral */
(() => {
  if (window.park.exports.config.commentType !== 'talk-v5') {
    return;
  }
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
  let offset = 10;
  let order = 'asc';
  let pagination = '';
  const userAbonnements = [
    'plus',
    'print',
    'digital',
    'mita',
  ];

  const getActionGroup = () => {
    let actionGroupTimer = 0;
    let result = false;
    const actionGroups = () => {
      if ((!window.dataLayer[0] ||
      !window.dataLayer[0].actionGroups ||
      !window.dataLayer[0].actionGroups.abonnement) &&
        actionGroupTimer < 100) {
        actionGroupTimer += 1;
        window.setTimeout(actionGroups, 50);
      } else if (typeof window.dataLayer[0].actionGroups.abonnement !== 'undefined') {
        result = userAbonnements.includes(window.dataLayer[0].actionGroups.abonnement);
      }
      return result;
    };
    return actionGroups();
  };

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

    window.park.ajax(`${url}&offset=${offset}&order=${order}&pagination=${pagination}`)
      .then(result => result.json())
      .then((result) => {
        const createComments = (aComments, counter = 0) => {
          aComments.forEach((comment) => {
            const elem = document.createElement(templateItem.nodeName.toLowerCase());
            const date = new Date(comment.time * 1000);
            let time = date.toLocaleString();

            elem.className = templateItem.className;
            elem.id = comment.id;
            elem.innerHTML = templateItemHtml;
            elem.querySelector('.park-comments__comment-text').innerHTML = comment.text;
            elem.querySelector('.park-comments__comment-user').textContent = comment.user;
            if (counter >= 1) {
              elem.setAttribute('class', 'is-reply');
              elem.setAttribute('style', `margin-left:${counter * 10}px;`);
            }
            try {
              time = date.toLocaleString('de-DE', timeOptions);
            } catch (e) {
              time = date.toLocaleString();
            }

            elem.querySelector('.park-comments__comment-link').href = `#${comment.id}`;
            elem.querySelector('.park-comments__comment-time').textContent = `${time} Uhr`;

            fragment.appendChild(elem);

            if (comment.reply && Array.isArray(comment.reply)) {
              createComments(comment.reply, counter + 1);
            } else if (counter > 0) {
              counter = -1;
            } else {
              counter = 0;
            }
          });
        };

        createComments(result.comments);
        list.appendChild(fragment);
        list.style.height = `${list.scrollHeight}px`;
        button.classList.remove('park-button--is-loading');
        comments.classList.add('park-comments--is-visible');
        pagination = result.pagination;

        setTimeout(() => {
          list.style.height = 'auto';
        }, 3000);

        if (result.length === 0) {
          comments.querySelector('.park-comments__wrapper').classList.add('park-comments--is-not-visible');
        } else if (result.length > 0) {
          comments.querySelector('.park-comments__wrapper').classList.remove('park-comments--is-not-visible');
        }
        // Button
        if (!result.hasNextPage) {
          comments.classList.add('park-comments--is-complete');
        } else {
          comments.classList.remove('park-comments--is-complete');
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
    offset = 10;
    pagination = '';
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

  function updateForm(comments) {
    if (!comments || !comments.querySelector) {
      return;
    }

    const form = comments.querySelector('.park-comments__wrapper');
    const iFrameBox = document.getElementById('coral_thread');
    const iFrame = document.getElementsByName('coral_thread_iframe');
    const rootUrl = `${iFrameBox.getAttribute('data-coral-root-url')}`;
    const storyID = `${iFrameBox.getAttribute('data-coral-story-id')}`;
    const storyURL = `${iFrameBox.getAttribute('data-coral-story-url')}`;
    const formDefault = comments.querySelector('.park-comments-form__default');
    const formSuspended = comments.querySelector('.park-comments-form__suspended');
    const formUnauthorized = comments.querySelector('.park-comments-form__unauthorized');
    const formNoAbo = comments.querySelector('.park-comments-form__noAbo');
    const authorisation = `${window.park.exports.config.rootBase}${comments.getAttribute('data-comments-authorisation')}`;

    if (window.park.user.isLoggedIn()) {
      window.park.user.getUser().then((user) => {
        if (user.suspended === true) {
          if (iFrame) {
            iFrameBox.innerHTML = '';
          }
          if (formDefault) {
            formDefault.setAttribute('aria-hidden', 'true');
          }
          if (formSuspended) {
            formSuspended.removeAttribute('aria-hidden');
          }
          if (form) {
            form.removeAttribute('aria-hidden');
          }
          if (formNoAbo) {
            formNoAbo.setAttribute('aria-hidden', 'true');
          }
        } else if (user && getActionGroup()) {
          if (form) {
            form.setAttribute('aria-hidden', 'true');
          }
          if (iFrameBox) {
            window.park.ajax(`${authorisation}&user=${JSON.stringify(user)}`)
              .then(token => token.json())
              .then((token) => {
                const loadingSpinner = document.getElementsByClassName('park-loading-spinner');
                loadingSpinner[0].style.display = 'block';
                (() => {
                  const d = document;
                  const s = d.createElement('script');
                  s.src = `${rootUrl}/assets/js/embed.js`;
                  s.async = false;
                  s.defer = true;
                  s.onload = () => {
                    Coral.createStreamEmbed({
                      events(events) {
                        events.onAny((eventName) => {
                          if (eventName === 'ready') {
                            loadingSpinner[0].style.display = 'none';
                            iFrameBox.classList.add('show');
                          }
                        });
                      },
                      id: 'coral_thread',
                      autoRender: true,
                      rootURL: `${rootUrl}`,
                      // Uncomment these lines and replace with the ID of the
                      // story's ID and URL from your CMS to provide the
                      // tightest integration. Refer to our documentation at
                      // https://docs.coralproject.net for all the configuration
                      // options.
                      storyID: `${storyID}`,
                      storyURL: `${storyURL}`,
                      accessToken: `${token}`,
                    });
                  };
                  (d.head || d.body).appendChild(s);
                })();
              })
              .catch((e) => {
                window.park.console.log(e);
              });
          }
          if (formDefault) {
            formDefault.removeAttribute('aria-hidden');
          }
          if (formSuspended) {
            formSuspended.setAttribute('aria-hidden', 'true');
          }
          if (formUnauthorized) {
            formUnauthorized.setAttribute('aria-hidden', 'true');
          }
          if (formNoAbo) {
            formNoAbo.setAttribute('aria-hidden', 'true');
          }
        } else {
          // user logged in but no abo
          if (iFrame) {
            iFrameBox.innerHTML = '';
            iFrameBox.classList.remove('show');
            iFrameBox.classList.add('hide');
          }
          if (formNoAbo) {
            formNoAbo.removeAttribute('aria-hidden');
          }
          if (form) {
            form.removeAttribute('aria-hidden');
          }
          if (formDefault) {
            formDefault.removeAttribute('aria-hidden');
          }
          if (formSuspended) {
            formSuspended.setAttribute('aria-hidden', 'true');
          }
          if (formUnauthorized) {
            formUnauthorized.setAttribute('aria-hidden', 'true');
          }
        }
      });
    } else {
      if (iFrame) {
        iFrameBox.innerHTML = '';
        iFrameBox.classList.remove('show');
        iFrameBox.classList.add('hide');
      }
      if (form) {
        form.removeAttribute('aria-hidden');
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
      if (formNoAbo) {
        formNoAbo.setAttribute('aria-hidden', 'true');
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

      // initial load of comments when user is logged in
      updateForm(comments);
    }
    // initial load of comments when user is not logged in
    fetchComments(comments);
  }, false);
})();
