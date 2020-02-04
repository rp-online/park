(() => {
  let widget;
  let timeout = 1000;

  window.setTimeout(() => {
    timeout = 0;
  }, 1000);

  function createNotificationWidget(data) {
    if (!data.id) {
      window.park.console.error('ID for notification widget is missing');
      return;
    }

    if (!window.park.widgets) {
      window.setTimeout(() => {
        createNotificationWidget(data);
      }, 100);
      return;
    }

    const snackbarsContainer = document.querySelector('.park-header__snackbars') ||
      document.querySelector('body');

    if (!snackbarsContainer) {
      window.setTimeout(() => {
        createNotificationWidget(data);
      }, 100);
      return;
    }

    data.startOpened = true;
    data.isSelfclosing = true;

    window.setTimeout(() => {
      if (widget) {
        widget = window.park.widgets.replace({
          type: 'notification-snackbar',
          initialState: data,
        }, widget);
      } else {
        widget = window.park.widgets.create({
          type: 'notification-snackbar',
          initialState: data,
        });

        window.park.$('.park-header__snackbars > .park-widget--notification-snackbar', snackbarsContainer).forEach((elem) => {
          snackbarsContainer.removeChild(elem);
        });

        snackbarsContainer.appendChild(widget);
      }
    }, timeout);
  }

  function create(data) {
    if (!data.id) {
      window.park.console.error('ID for notification widget is missing');
      return;
    }

    createNotificationWidget({
      id: data.id,
      children: [
        {
          component: 'notification',
          data: data.data,
        },
      ],
    });
  }

  // const previousURL = (window.park.storage.get('park.login.referrer')) ?
  // window.park.storage.get('park.login.referrer') : '';

  switch (window.location.hash) {
    case '#successRegistration' :
      createNotificationWidget({
        id: 'welcome',
        children: [
          {
            component: 'notification',
            data: {
              headline: 'Erfolgreich registriert',
              type: 'success',
            },
          },
        ],
      });
      break;

    case '#successLogin' :
      createNotificationWidget({
        id: 'login',
        children: [
          {
            component: 'notification',
            data: {
              headline: 'Erfolgreich angemeldet',
              type: 'success',
            },
          },
        ],
      });
      break;

    case '#successRegister' :
      createNotificationWidget({
        id: 'register ',
        children: [
          {
            component: 'notification',
            data: {
              headline: 'Vielen Dank für Ihre Registrierung. Wir haben Ihnen soeben eine E-Mail geschickt. Bitte bestätigen Sie Ihre Angaben durch Klick auf den enthaltenen Link. ',
              type: 'success',
            },
          },
        ],
      });
      break;

    case '#successGoogleConnected' :
      createNotificationWidget({
        id: 'googleConnected',
        children: [
          {
            component: 'notification',
            data: {
              headline: 'Wir haben Ihren Google Account mit dem bestehendem Account zusammengeführt. Sie sind jetzt eingeloggt.',
              type: 'success',
            },
          },
        ],
      });
      break;

    case '#successGoogleRegistered' :
      createNotificationWidget({
        id: 'googleRegistered',
        children: [
          {
            component: 'notification',
            data: {
              headline: 'Ihre Registrierung war erfolgreich. Sie sind jetzt eingeloggt.',
              type: 'success',
            },
          },
        ],
      });
      break;

    case '#successLogout' :
      createNotificationWidget({
        id: 'logout',
        children: [
          {
            component: 'notification',
            data: {
              headline: 'Erfolgreich abgemeldet',
              type: 'success',
            },
          },
        ],
      });
      break;

    case '#unsubscribeSuccess' :
      createNotificationWidget({
        id: 'unsubscribe',
        children: [
          {
            component: 'notification',
            data: {
              headline: 'Benachrichtungen deaktiviert',
              type: 'success',
            },
          },
        ],
      });
      break;

    case '#unsubscribeError' :
      createNotificationWidget({
        id: 'unsubscribe',
        children: [
          {
            component: 'notification',
            data: {
              headline: 'Benachrichtungen sind bereits deaktiviert',
              type: 'error',
            },
          },
        ],
      });
      break;

    case '#redirect' :
    case '#articleNotFound' :
      break;

    default:
  }

  window.park = Object.assign({}, window.park, {
    notifications: {
      create,
    },
  });
})();
