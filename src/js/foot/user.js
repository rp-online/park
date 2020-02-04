(() => {
  const config = window.park.exports.config;
  const favicon = document.querySelector('link[rel="icon"][href*=".ico"]');
  const faviconSrc = favicon ? favicon.href.replace(/favicon\.ico/, 'favicon-96x96.png') : '';

  const isClickDummy = (
    window.park.exports &&
    window.park.exports.config &&
    window.park.exports.config.isClickDummy
  );

  function clearLocalData() {
    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.user:logout', { reason: 'clearlocaldata' });
    }
    window.park.storage.remove('park.user.authenticated');
    window.park.storage.remove('park.user.preferences');
    window.park.storage.remove('park.user');
    document.documentElement.classList.remove('user-is-authenticated');

    // also delete any sso cookies
    window.park.cookie.set('sso_user', '', -1);
    window.park.cookie.set('sso', '', -1);
    window.park.cookie.set('sso-sid', '', -1);
    window.park.cookie.set('IR_SSO', '', -1);

    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.user:authchange');
    }
  }

  function updateFavicon(count = 0) {
    if (!faviconSrc) {
      return;
    }

    const img = document.createElement('img');

    img.onload = () => {
      const lineWidth = 2;
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const context = canvas.getContext('2d');
      context.clearRect(0, 0, img.width, img.height);
      context.drawImage(img, 0, 0);

      const centerX = img.width - (img.width / 4.5) - lineWidth;
      const centerY = (img.height / 4.5) - lineWidth;
      const radius = img.width / 4.5;

      context.fillStyle = 'red';
      context.strokeStyle = 'red';
      context.lineWidth = lineWidth;

      if (count) {
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
        context.stroke();
      }

      [
        'icon',
        'shortcut icon',
      ].forEach((rel) => {
        const favicon = document.querySelector(`link[rel="${rel}"]`);

        favicon.type = 'image/png';
        favicon.removeAttribute('sizes');
        favicon.href = context.canvas.toDataURL();
      });
    };
    img.src = faviconSrc;
  }

  let checkNewSubscriptionsTimeout = null;
  const checkNewSubscriptions = () => {
    window.clearTimeout(checkNewSubscriptionsTimeout);
    const process = (subscriptionsCount, unreads) => {
      window.park.storage.set('park.user.subscriptionsCount', subscriptionsCount);

      const previousUnreads = window.park.storage.get('park.user.subscriptionsUnread', true);

      const unreadsCount = unreads.length;

      window.park.storage.set('park.user.subscriptionsUnreadCount', unreadsCount);

      if (unreadsCount) {
        document.title = `(${unreadsCount}) ${document.title.replace(/^\(\d+\)\s*/, '')}`;
      } else {
        document.title = document.title.replace(/^\(\d+\)\s*/, '');
      }

      updateFavicon(unreadsCount);

      if (unreads.length && JSON.stringify(previousUnreads) !== JSON.stringify(unreads)) {
        window.park.storage.set('park.user.subscriptionsUnread', unreads, true);
      }

      if (window.park.eventHub) {
        window.park.eventHub.trigger(document, 'park.user:authchange');
      }

      if (subscriptionsCount > 0) {
        checkNewSubscriptionsTimeout = window.setTimeout(checkNewSubscriptions, 600000);
      }
    };
    const promises = [
      window.park.api.getUserPreferences(),
      window.park.user.getSubscribedUnread(),
    ];

    Promise.all(promises)
      .then((results) => {
        window.park.user.setPreferences(results[0]);

        const subscriptionsCount =
          (results[0].authors && results[0].authors.length ? results[0].authors.length : 0) +
          (results[0].topics && results[0].topics.length ? results[0].topics.length : 0);
        const unreads = results[1];
        process(subscriptionsCount, unreads);
      })
      .catch(() => {
        process(0, []);
      });
  };

  window.park = Object.assign({}, window.park, {
    user: {
      isLoggedIn() {
        return isClickDummy
          ? window.park.storage.get('park.user.authenticated') : !!window.park.cookie.get('sso_user');
      },
      login() {
        window.park.storage.set('park.user.authenticated', true);
        document.documentElement.classList.add('user-is-authenticated');

        window.setTimeout(() => {
          window.location.href = `${window.location.href.replace(/#.+$/, '')}#successLogin`;
        }, isClickDummy ? 0 : 3000);

        if (window.park.eventHub) {
          window.park.eventHub.trigger(document, 'park.user:authchange');
        }

        if (location.hash === '') {
          window.park.notifications.create({
            id: 'login',
            data: {
              headline: 'Erfolgreich angemeldet',
              type: 'success',
            },
          });
        }
      },
      logout(forceLogoutState) {
        if (window.console && console.trace) {
          console.trace();
        }

        const handleLogout = () => {
          if (window.park.eventHub) {
            window.park.eventHub.trigger(document, 'park.user:logout', { reason: 'handlelogout' });
          }
          clearLocalData();
          if (window.park.exports.config.personalArea) {
            // Still redirect if the user is in the personal area
            window.location.href = '/#successLogout';
          } else {
            window.location.href = `${window.location.href.replace(/#.+$/, '')}#successLogout`;

            if (window.park.eventHub) {
              window.park.eventHub.trigger(document, 'park.user:authchange');
            }

            window.park.notifications.create({
              id: 'logout',
              data: {
                headline: 'Erfolgreich abgemeldet',
                type: 'success',
              },
            });
          }
        };

        if (isClickDummy || forceLogoutState) {
          if (window.park.eventHub) {
            window.park.eventHub.trigger(document, 'park.user:logout', { reason: 'handleLogout: isClickDummy||forceLogoutState' });
          }
          handleLogout();
          // return since the logout won't be working after deleting all user data
          return;
        }

        window.park.api.logout().then((result) => {
          if (result.errors) {
            console.warn('Error while logging out occurred: ', result);
            if (window.park.eventHub) {
              window.park.eventHub.trigger(document, 'park.user:logout', { reason: 'handleLogout: logout api result error' });
            }
          }
          handleLogout();
        });
      },
      getSSOCookieSnippet() {
        if (isClickDummy) {
          return Promise.resolve(this.isLoggedIn() ? '' : false);
        }
        return this.getUser().then(user => user && user.ssoCookieSnippet);
      },
      getUsername() {
        if (isClickDummy) {
          return Promise.resolve(this.isLoggedIn() ? 'Bingobongo23' : false);
        }
        return this.getUser().then(user => user && user.username);
      },
      setItemBookmarkState(itemId, addBookmark) {
        if (window.park.eventHub) {
          window.park.eventHub.trigger(document, 'park.user:bookmarkschange');
        }

        if (isClickDummy) {
          return new Promise(resolve => resolve(undefined));
        }

        if (addBookmark) {
          const data = new FormData();
          data.append('id', itemId);
          window.park.api.addBookmark(data).then((result) => {
            if (result.errors) {
              window.park.console.error(result);
            }
          });
        } else {
          window.park.api.deleteBookmark(itemId).then((result) => {
            if (result.errors) {
              window.park.console.error(result);
            }
          });
        }

        return this.getPreferences()
          .then((preferences) => {
            let bookmarks = (preferences && preferences.bookmarks) || [];
            if (addBookmark) {
              bookmarks.push(itemId);
            } else {
              bookmarks = bookmarks.filter(item => item !== itemId);
            }
            return Object.assign({}, preferences, { bookmarks });
          })
          .then(newPrefs => this.setPreferences(newPrefs));
      },
      getItemBookmarkedState(itemId) {
        if (isClickDummy) {
          const result = this.isLoggedIn() ? !!Math.floor(Math.random() + 0.5) : false;
          return new Promise(resolve => resolve(result));
        }
        return this.getPreferences()
          .then(preferences => preferences && preferences.bookmarks)
          .then(bookmarks => bookmarks && bookmarks.length > 0 && bookmarks.indexOf(itemId) > -1);
      },
      getSubscribedUnread() {
        return new Promise((resolve) => {
          window.park.api.getSubscribedUnread().then((result) => {
            if (!result.data) {
              return;
            }

            resolve(result.data);
          });
        });
      },
      resetSubscribedUnread() {
        if (!this.isLoggedIn()) {
          return new Promise(resolve => resolve(false));
        }

        return new Promise((resolve) => {
          window.park.api.resetSubscribedUnread().then(() => {
            checkNewSubscriptions();
            resolve();
          });
        });
      },
      setSubscriptionState(itemType, itemId, addSubscription) {
        if (window.park.eventHub) {
          window.park.eventHub.trigger(document, 'park.user:subscriptionschange');
        }

        let apiSubscribeMethodName;
        let apiUnsubscribeMethodName;

        switch (itemType) {
          case 'author':
            apiSubscribeMethodName = 'subscribeToAuthor';
            apiUnsubscribeMethodName = 'unsubscribeFromAuthor';
            break;

          case 'topic':
            apiSubscribeMethodName = 'subscribeToTopic';
            apiUnsubscribeMethodName = 'unsubscribeFromTopic';
            break;

          default:
            window.park.console.error('Invalid subscription type');
            return new Promise(resolve => resolve(undefined));
        }

        if (addSubscription) {
          const data = new FormData();
          data.append('id', itemId);
          window.park.api[apiSubscribeMethodName](data).then((result) => {
            if (result.errors) {
              window.park.console.error(result);
            }
          });
        } else {
          window.park.api[apiUnsubscribeMethodName](itemId).then((result) => {
            if (result.errors) {
              window.park.console.error(result);
            }
          });
        }

        return this.getPreferences()
          .then((preferences) => {
            let subscriptions = JSON.parse(JSON.stringify((preferences && preferences[`${itemType}s`]) || []));

            if (addSubscription) {
              subscriptions.push(itemId);
            } else {
              subscriptions = subscriptions.filter(item => item !== itemId);
            }

            preferences[`${itemType}s`] = subscriptions;

            return preferences;
          })
          .then(newPrefs => this.setPreferences(newPrefs))
          .catch(() => {
            window.park.console.error('Error getting the current user\'s preferences');
          });
      },
      getSubscriptionState(itemType, itemId) {
        if (isClickDummy) {
          const result = this.isLoggedIn() ? !!Math.floor(Math.random() + 0.5) : false;
          return new Promise(resolve => resolve(result));
        }

        if (!window.park.user.isLoggedIn()) {
          return new Promise(resolve => resolve(false));
        }

        return this.getPreferences()
          .then((preferences) => {
            if (
              preferences &&
              preferences[`${itemType}s`]
            ) {
              const subscriptions = preferences[`${itemType}s`];

              return subscriptions &&
                subscriptions.length &&
                subscriptions.indexOf(itemId) > -1;
            }
            return false;
          });
      },
      getSubscriptions(itemType) {
        if (!window.park.user.isLoggedIn()) {
          return new Promise(resolve => resolve([]));
        }

        switch (itemType) {
          default:
            return new Promise(resolve => resolve([]));

          case 'author':
            if (isClickDummy) {
              const result = this.isLoggedIn() ? [] : false;
              return new Promise(resolve => resolve(result));
            }
            return window.park.api.getSubscribedAuthors().then(result => result.data);

          case 'topic':
            if (isClickDummy) {
              const result = this.isLoggedIn() ? [] : false;
              return new Promise(resolve => resolve(result));
            }
            return window.park.api.getSubscribedTopics().then(result => result.data);
        }
      },
      getPreferredCities() {
        if (isClickDummy) {
          return Promise.resolve(this.isLoggedIn() ? [
            {
              href: '#duesseldorf',
              text: 'Düsseldorf',
            },
            {
              href: '#neuss',
              text: 'Neuss',
            },
            {
              href: '#moenchengladbach',
              text: 'Mönchengladbach',
            },
            {
              href: '#krefeld',
              text: 'Krefeld',
            },
            {
              href: '#duisburg',
              text: 'Duisburg',
            },
            {
              href: '#allcities',
              text: 'Alle Städte',
            },
          ] : false);
        }
        return this.getPreferences()
          .then(preferences => (preferences && preferences.cities) || []);
      },
      getPreferredSportsclubs() {
        if (isClickDummy) {
          return Promise.resolve(this.isLoggedIn() ? [
            {
              icon: './assets/images/sprite.sportsclubs.svg#fortuna-duesseldorf',
              href: '#fortuna-duesseldorf',
              text: 'Fortuna Düsseldorf',
            },
            {
              icon: './assets/images/sprite.sportsclubs.svg#1-fc-kaiserslautern',
              href: '#1-fc-kaiserslautern',
              text: '1. FC Kaiserslautern',
            },
            {
              icon: './assets/images/sprite.sportsclubs.svg#msv-duisburg',
              href: '#msv-duisburg',
              text: 'MzssoV Duisburg',
            },
            {
              icon: './assets/images/sprite.sportsclubs.svg#borussia-dortmund',
              href: '#borussia-dortmund',
              text: 'Borussia Dortmund',
            },
            {
              icon: './assets/images/sprite.sportsclubs.svg#vfl-bochum',
              href: '#vfl-bochum',
              text: 'VfL Bochum',
            },
          ] : false);
        }
        return this.getPreferences()
          .then(preferences => (preferences && preferences.sportsclubs) || []);
      },
      getWeatherRegion() {
        if (isClickDummy) {
          return Promise.resolve(this.isLoggedIn() ? 'nettetal' : false);
        }
        return this.getPreferences().then(preferences => preferences && preferences.weather);
      },
      getTrafficRoads() {
        if (isClickDummy) {
          return Promise.resolve(this.isLoggedIn() ? ['A3', 'A4'] : false);
        }
        return this.getPreferences().then(preferences => preferences && preferences.highways);
      },
      getPreferences() {
        if (isClickDummy) {
          return Promise.resolve(this.isLoggedIn() ? {
            weather: 'düsseldorf',
            highways: [
              'A2',
            ],
            cities: [
              {
                id: '64706',
                href: '/nrw/staedte/dormagen/',
                text: 'Dormagen',
              },
            ],
            sportsclubs: [
              {
                id: '65021',
                icon: '/assets/images/sprite.sportsclubs.svg#fc-koeln',
                href: '/sport/fussball/1-fc-koeln/',
                text: '1. FC Köln',
              },
            ],
            bookmarks: [
              '36552485',
              '36548295',
            ],
            authors: [
              'H502781',
            ],
            topics: [],
          } : false);
        }
        try {
          const preferences = this.isLoggedIn() ? window.park.storage.get('park.user.preferences') : false;
          if (!preferences) {
            return Promise.reject(false);
          }
          return Promise.resolve(preferences);
        } catch (e) {
          console.warn('Error while parsing user preferences', e);
        }
        return Promise.reject(false);
      },
      setPreferences(preferences) {
        window.park.storage.set('park.user.preferences', preferences);

        const subscriptionsCount =
          (preferences.authors && preferences.authors.length ? preferences.authors.length : 0) +
          (preferences.topics && preferences.topics.length ? preferences.topics.length : 0);

        window.park.storage.set('park.user.subscriptionsCount', subscriptionsCount);
      },
      setUser(user) {
        window.park.storage.set('park.user', user);
      },
      getUser() {
        try {
          const user = this.isLoggedIn() ? window.park.storage.get('park.user') : false;
          return Promise.resolve(user);
        } catch (e) {
          console.warn('Error while parsing user', e);
        }
        return Promise.resolve(false);
      },
    },
  });

  if (window.park.user.isLoggedIn()) {
    document.documentElement.classList.add('user-is-authenticated');

    if (
      !config.appMode &&
      (
        config.notifications &&
        config.notifications.distribution &&
        config.notifications.distribution.onsite
      )
    ) {
      checkNewSubscriptions();
    }

    document.addEventListener('park.notification-panel:seen', () => {
      window.park.user.resetSubscribedUnread();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (isClickDummy) {
      return;
    }

    // If the old SSO cookie exists, but no park sso_user cookie
    if (window.park.cookie.get('sso') && !window.park.cookie.get('sso_user')) {
      if (window.park.eventHub) {
        window.park.eventHub.trigger(document, 'park.user:logout', { reason: 'logout: cookiematch: sso, !sso_user' });
      }
      window.park.console.warn('Old sso cookie exists, but no new park sso_user cookie');
      window.park.user.logout();
    }

    // If there is a sso-sid cookie but no sso cookie => old httpOnly cookie detected => logout
    if (window.park.cookie.get('sso-sid') && !window.park.cookie.get('sso') && !window.park.cookie.get('IR_SSO')) {
      if (window.park.eventHub) {
        window.park.eventHub.trigger(document, 'park.user:logout', { reason: 'logout: cookiematch: sso-sid, !sso, !IR_SSO' });
      }
      window.park.console.warn('sso-sid detected but no sso => logout');
      window.park.user.logout();
      return;
    }

    if (window.park.cookie.get('sso_user')) {
      // If there is the sso_user cookie but no sso cookie => old httpOnly cookie detected => logout
      if (!window.park.cookie.get('sso') && !window.park.cookie.get('IR_SSO')) {
        if (window.park.eventHub) {
          window.park.eventHub.trigger(document, 'park.user:logout', { reason: 'logout: cookiemissmatch: sso_user, !sso, !IR_SSO' });
        }
        window.park.console.warn('sso_user detected but no IR_SSO => logout');
        window.park.user.logout();
        return;
      }
      // If there is a user cookie but not data in the storage (e.g. due to FB Login) fetch it
      // TODO: Consider removing this endpoint, since it happens rarely.
      if (!window.park.storage.get('park.user.authenticated') || !window.park.storage.get('park.user')) {
        window.park.api.verifyCurrentUser().then((result) => {
          if (result.errors) {
            if (window.park.eventHub) {
              window.park.eventHub.trigger(document, 'park.user:logout', { reason: 'wipe: verifyCurrentUser error: sso_user, !park.user' });
            }
            clearLocalData();
            return;
          }
          window.park.user.setUser(result.user);
          window.park.user.login();
          window.park.api.getUserPreferences()
            .then(preferences => window.park.user.setPreferences(preferences));
        });
      }
      // Fehlender sso_autologin triggered neues verifyCurrentUser an.
      if (window.park.cookie.get('sso') && !window.park.cookie.get('sso_autologin')) {
        window.park.api.verifyCurrentUser().then((result) => {
          if (result.errors) {
            if (window.park.eventHub) {
              window.park.eventHub.trigger(document, 'park.user:logout', { reason: 'wipe: verifyCurrentUser error: sso_user, sso, !sso_autologin' });
            }
            clearLocalData();
            return;
          }
          window.park.user.setUser(result.user);
          window.park.user.login();
          window.park.api.getUserPreferences()
            .then(preferences => window.park.user.setPreferences(preferences));
        });
      }
      // Increase Counter when everything worked to this point
      window.park.api.updateCounter().then((result) => {
        if (result.errors) {
          clearLocalData();
        }
      });
    } else {
      if (window.park.eventHub) {
        window.park.eventHub.trigger(document, 'park.user:logout', { reason: 'wipe: no cookie loaded' });
      }
      // If there is no cookie (since it could be expired), make sure that all ls data is wiped too.
      clearLocalData();
    }
  });

  window.addEventListener('storage', () => {
    window.setTimeout(() => {
      if (window.park.user.isLoggedIn()) {
        document.documentElement.classList.add('user-is-authenticated');
        const unreadCount = parseInt(window.park.storage.get('park.user.subscriptionsUnreadCount') || 0, 10);
        updateFavicon(unreadCount);
      } else {
        document.documentElement.classList.remove('user-is-authenticated');
        updateFavicon(0);
      }

      if (window.park.eventHub) {
        window.park.eventHub.trigger(document, 'park.user:authchange');
      }
    });
  });
})();
