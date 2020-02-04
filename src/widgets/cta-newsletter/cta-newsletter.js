(() => {
  function reducer(state, action) {
    switch (action.type) {
      case 'SET-OPTIONS':
        state.options = action.value;
        break;

      case 'RESET':
        return Object.assign({}, state, {
          step: 1,
          email: undefined,
          list_id: undefined,
        });


      case 'NEXT-STEP':
        state.step = (state.step || 1) + 1;
        return Object.assign({}, state, action.value);

      default:
        break;
    }

    return state;
  }

  window.park.app({
    container: 'cta-newsletter',
    component: 'cta-newsletter',
    reducer,
  }).then((app) => {
    const state = app.store.getState();
    const groupName = state.groupName;

    window.park.api.retrieveAvailableNewsletters(groupName)
      .then((result) => {
        if (result.errors && typeof result.errors === 'object' && result.errors.length) {
          window.park.notifications.create({
            id: 'cta-newsletter-error',
            data: {
              headline: result.errors.text,
              type: 'error',
            },
          });
          return;
        }

        if (!result.data) {
          return;
        }

        const options = result.data.map(result => ({
          value: result.ms_list_id,
          label: result.city || result.ms_mailingname,
        }));

        app.store.dispatch({
          type: 'SET-OPTIONS',
          value: options,
        });
      });

    app.bindEvent('submit', '.park-form', (e) => {
      const form = e.target;
      const elem = form.closest('.park-cta-newsletter');
      const state = app.store.getState();
      const data = new FormData(e.target);

      if ((state.step || 1) === 1 && state.optin) {
        window.setTimeout(() => {
          app.store.dispatch({
            type: 'NEXT-STEP',
            value: {
              list_id: data.get('list_ids[]'),
              email: data.get('email'),
            },
          });
        }, 200);

        e.preventDefault();
        return;
      }

      data.append('opt_in', state.optin ? 1 : 0);

      if (window.location.search) {
        const query = window.location.search.slice(1);
        const pairs = query.split('&');

        pairs.forEach((pair) => {
          if (!pair.startsWith('utm') || pair.indexOf('=') === -1) {
            return;
          }

          const parts = pair.split('=');

          data.append(parts[0], parts[1]);
        });
      }

      window.park.api.subscribeToNewsletters(data)
        .then((result) => {
          if (result.errors && typeof result.errors === 'object' && result.errors.length) {
            window.park.notifications.create({
              id: 'cta-newsletter-error',
              data: {
                headline: result.errors[0].text,
                type: 'error',
              },
            });
            return;
          }

          window.park.notifications.create({
            id: 'cta-newsletter-subscribed',
            data: {
              headline: 'Der Newsletter wurde erfolgreich abonniert. Wir haben Ihnen eine Bestätigung per E-Mail geschickt.',
              type: 'success',
            },
          });

          window.park.eventHub.trigger(elem, 'park.ctaNewsletter:subscribed', {
            list_ids: data.get('list_ids[]'),
            groupName: state.groupName,
            optin: state.optin,
          });
          window.park.eventHub.trigger(elem, 'park.suppressible:hide-permanently');

          app.store.dispatch({
            type: 'RESET',
          });

          window.setTimeout(() => {
            elem.querySelector('.park-button[type="submit"]').disabled = false;
          }, 200);
        })
        .catch((errors) => {
          console.error('error', errors);
          window.park.notifications.create({
            id: 'cta-newsletter-error',
            data: {
              headline: 'Leider ist in der weiteren Verarbeitung ein Fehler aufgetreten, mit dem wir nicht gerechnet haben.',
              type: 'error',
            },
          });
        });

      e.preventDefault();
    });
  });
})();
