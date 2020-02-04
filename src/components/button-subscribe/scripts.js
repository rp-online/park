(() => {
  const toggleTimeouts = window.WeakMap ? new WeakMap() : new Map();

  window.park.eventHub.register('click park:toggle-on', '.park-button-subscribe', (e) => {
    const elem = e.target.closest('[data-subscribe]');
    const itemType = elem.getAttribute('data-subscription-item-type');
    const itemId = elem.getAttribute('data-subscription-item-id');
    const isSubscribed = elem.matches('.is-subscribed');
    const subscribeText = elem.getAttribute('data-subscribe-text');
    const unsubscribeText = elem.getAttribute('data-unsubscribe-text');
    const subscribeSuccessText = elem.getAttribute('data-subscribe-success-text');
    const unsubscribeSuccessText = elem.getAttribute('data-unsubscribe-success-text');
    const showSuccessMessage = function showSuccessMessage(isSubscribed) {
      if (isSubscribed && e.type !== 'park:toggle-on') {
        elem.textContent = subscribeText;
        elem.setAttribute('title', subscribeText);
        elem.classList.remove('is-subscribed');
        window.park.notifications.create({
          id: 'unsubscribe-success',
          data: {
            headline: unsubscribeSuccessText,
            type: 'success',
          },
        });
      } else {
        elem.textContent = unsubscribeText;
        elem.setAttribute('title', unsubscribeText);
        elem.classList.add('is-subscribed');
        window.park.notifications.create({
          id: 'subscribe-success',
          data: {
            headline: subscribeSuccessText,
            type: 'success',
          },
        });
      }

      elem.classList.remove('was-just-toggled');
      window.clearTimeout(toggleTimeouts[elem]);
      window.setTimeout(() => {
        elem.classList.add('was-just-toggled');
        toggleTimeouts[elem] = window.setTimeout(() => {
          elem.classList.remove('was-just-toggled');
        }, 1300);
      });
    };

    if (!window.park.user.isLoggedIn()) {
      return;
    }

    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.button-subscribe:toggled', {
        elem,
        itemType,
        itemId,
        isSubscribed,
      });
    }

    window.park.user.setSubscriptionState(itemType, itemId, !isSubscribed).then(() => {
      showSuccessMessage(isSubscribed);
    });
  });

  window.park.observer.initialize('.park-button-subscribe', (elem) => {
    const subscribeText = elem.getAttribute('data-subscribe-text');
    const unsubscribeText = elem.getAttribute('data-unsubscribe-text');

    function update(elem) {
      const itemType = elem.getAttribute('data-subscription-item-type');
      const itemId = elem.getAttribute('data-subscription-item-id');

      window.park.user.getSubscriptionState(itemType, itemId).then((isSubscribed) => {
        if (isSubscribed) {
          elem.classList.add('is-subscribed');
          elem.textContent = unsubscribeText;
          elem.setAttribute('title', unsubscribeText);
        } else {
          elem.classList.remove('is-subscribed');
          elem.textContent = subscribeText;
          elem.setAttribute('title', subscribeText);
        }
      });
    }

    document.addEventListener('park.user:authchange', () => {
      update(elem);
    });

    update(elem);
  }, false);
})();
