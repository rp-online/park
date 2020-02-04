(() => {
  const isClickDummy = (
    window.park.exports &&
    window.park.exports.config &&
    window.park.exports.config.isClickDummy
  );

  const rootBase = window.park.exports.config.rootBase;

  const api = {
    login(formData) {
      return window.park.ajax(`${rootBase}/api/sso/login`, { method: 'post', body: formData }).then(result => result.json());
    },
    logout() {
      return window.park.ajax(`${rootBase}/api/sso/logout`, { method: 'post' }).then(result => result.json());
    },
    register(formData) {
      return window.park.ajax(`${rootBase}/api/sso/register`, { method: 'post', body: formData }).then(result => result.json());
    },
    newValidationEmail(formData) {
      return window.park.ajax(`${rootBase}/api/sso/new_validation_email`, { method: 'post', body: formData }).then(result => result.json());
    },
    resetPassword(formData) {
      return window.park.ajax(`${rootBase}/api/sso/reset_password`, { method: 'post', body: formData }).then(result => result.json());
    },
    changePassword(formData) {
      return window.park.ajax(`${rootBase}/api/sso/change_password`, { method: 'post', body: formData }).then(result => result.json());
    },
    verifyPassword(formData) {
      return window.park.ajax(`${rootBase}/api/sso/verify_user`, { method: 'post', body: formData }).then(result => result.json());
    },
    changeProfile(formData) {
      return window.park.ajax(`${rootBase}/api/sso/change_user_data`, { method: 'post', body: formData }).then(result => result.json());
    },
    currentUser(formData) {
      return window.park.ajax(`${rootBase}/api/sso/current_user`, { method: 'post', body: formData }).then(result => result.json());
    },
    verifyCurrentUser() {
      return window.park.ajax(`${rootBase}/api/sso/verify_current_user`, { method: 'post' }).then(result => result.json());
    },
    updateCounter() {
      return window.park.ajax(`${rootBase}/api/sso/update_counter`, { method: 'post' }).then(result => result.json());
    },
    getUserPreferences() {
      return window.park.ajax(`${rootBase}/api/p13n/`).then(result => result.json()).then(json => json.data);
    },
    setUserPreferences(formData) {
      return window.park.ajax(`${rootBase}/api/p13n/`, { method: 'post', body: formData }).then(result => result.json());
    },
    addBookmark(formData) {
      return window.park.ajax(`${rootBase}/api/bookmarks/`, { method: 'post', body: formData }).then(result => result.json());
    },
    deleteBookmark(id) {
      return window.park.ajax(`${rootBase}/api/bookmarks/${id}`, { method: 'delete' }).then(result => result.json());
    },
    subscribeToAuthor(formData) {
      return window.park.ajax(`${rootBase}/api/subscriptions/authors/`, { method: 'post', body: formData }).then(result => result.json());
    },
    unsubscribeFromAuthor(id) {
      return window.park.ajax(`${rootBase}/api/subscriptions/authors/${id}`, { method: 'delete' }).then(result => result.json());
    },
    subscribeToTopic(formData) {
      return window.park.ajax(`${rootBase}/api/subscriptions/topics/`, { method: 'post', body: formData }).then(result => result.json());
    },
    unsubscribeFromTopic(id) {
      return window.park.ajax(`${rootBase}/api/subscriptions/topics/${id}`, { method: 'delete' }).then(result => result.json());
    },
    getSubscribedAuthors() {
      return window.park.ajax(`${rootBase}/api/subscriptions/authors/`).then(result => result.json());
    },
    getSubscribedTopics() {
      return window.park.ajax(`${rootBase}/api/subscriptions/topics/`).then(result => result.json());
    },
    getSubscribedUnread() {
      return window.park.ajax(`${rootBase}/api/subscriptions/unread/`).then(result => result.json());
    },
    resetSubscribedUnread() {
      return window.park.ajax(`${rootBase}/api/subscriptions/unread/`, { method: 'delete' }).then(result => result.json());
    },
    createComment(formData) {
      return window.park.ajax(`${rootBase}/api/comments`, { credentials: true, method: 'post', body: formData }).then(result => result.json());
    },
    retrieveAvailableNewsletters(groupName) {
      return window.park.ajax(`${rootBase}/app/newsletter/api/configuration/${groupName}/`).then(result => result.json());
    },
    subscribeToNewsletters(formData) {
      return window.park.ajax(`${rootBase}/app/newsletter/api/subscriptions/`, { method: 'post', body: formData }).then(result => result.json());
    },
    getThirdPartyPrivacyConfig() {
      return window.park.ajax(`${rootBase}/api/thirdpartyprivacy/`).then(result => result.json());
    },
  };

  if (isClickDummy) {
    Object.keys(api).forEach((key) => {
      switch (key) {
        case 'retrieveAvailableNewsletters':
          api[key] = groupName => new Promise((resolve) => {
            window.setTimeout(() => {
              switch (groupName) {
                case 'stimme-des-westens':
                  resolve({
                    data: [
                      {
                        ms_list_id: '275',
                        city: '',
                        ms_mailingname: 'Stimme des Westens',
                      },
                    ],
                  });
                  break;

                default:
                  resolve({
                    data: [
                      {
                        ms_list_id: '295',
                        city: 'Solingen',
                        ms_mailingname: 'Total lokal',
                      },
                      {
                        ms_list_id: '275',
                        city: 'Düsseldorf',
                        ms_mailingname: 'Total lokal',
                      },
                    ],
                  });
                  break;
              }
            }, 1000);
          });
          break;

        case 'subscribeToNewsletters':
          api[key] = formData => window.park.ajax('/submit-target.php', { method: 'post', body: formData }).then(result => result.json());
          break;

        case 'getThirdPartyPrivacyConfig':
          api[key] = (...args) => {
            window.park.console.log(args);
            return new Promise((resolve) => {
              window.setTimeout(() => {
                resolve({
                  thirdParties: [
                    {
                      name: 'YouTube',
                      description: 'Text zum Datenschutz mit Links zur Datenschutzerklärung bei YouTube und ggf. noch ein bisschen HTML',
                    },
                    {
                      name: 'Twitter',
                      description: 'Text zum Datenschutz mit Links zur Datenschutzerklärung bei Twitter',
                    },
                  ],
                });
              }, 5000);
            });
          };
          break;

        default:
          api[key] = (...args) => {
            window.park.console.log(args);
            return new Promise((resolve) => {
              window.setTimeout(() => {
                resolve({});
              }, 5000);
            });
          };
          break;
      }
    });
  }

  window.park = Object.assign({}, window.park, {
    api,
  });
})();
