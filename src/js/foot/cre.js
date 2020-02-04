(() => {
  const isClickDummy = (
    window.park.exports &&
    window.park.exports.config &&
    window.park.exports.config.isClickDummy
  );
  const isApp = (
    window.park.exports &&
    window.park.exports.config &&
    window.park.exports.config.isApp
  );
  const isMobile = window.park.device.isMobile();
  let origin = 'web';
  let utmMedium = 'paywall';
  let loginUrl = '/sso/login';

  const freemiumData = {
    headline: 'Weiterlesen ist kostenlos',
    text: 'Wir möchten Sie nur gerne kennenlernen - Ihre E-Mail Adresse reicht. Registrieren Sie sich kostenlos, dann schalten wir diesen Artikel für Sie frei.',
    subline: 'Die Registrierung beinhaltet den Erhalt von Werbemailings zu unseren Angeboten.*',
    footer: { text: '* Ich bin einverstanden, dass mich die Rheinische Post Verlagsgesellschaft mbH per E-Mail über passende Verlagsangebote (Print- und Onlineabonnements, Gewinnspiele, Veranstaltungen und RP Shop Artikel) persönlich informiert und kann dies jederzeit widerrufen (per Abmeldelink im Newsletter oder per E-Mail an <a href="mailto:leserservice@rheinische-post.de">leserservice@rheinische-post.de</a>). <br><br><strong>Die Zustimmung wird ausdrücklich als vertragliche Gegenleistung für die zur Verfügung gestellten registrierungspflichtigen Artikel und Zusatzfunktionen auf RP ONLINE vereinbart. Die Angabe einer gültigen E-Mail-Adresse ist für die Registrierung erforderlich und kann ohne sie nicht erfolgen.</strong> Mit der Registrierung erkläre ich mich mit den <a href="/info/agb" target="_blank">Teilnahmebedingungen</a> und der <a href="/info/datenschutz" target="_blank">Datenschutzerklärung</a> einverstanden.' },
    cta: {
      text: 'Jetzt Registrieren',
      href: `/sso/register?utm_source=rpo&utm_medium=${utmMedium}`,
    },
    login: {
      text: 'Bereits registriert?',
      cta: {
        text: 'Jetzt anmelden.',
        href: '/sso/login',
      },
    },
    vendors: {
      loginWithGoogle: true,
    },
  };
  const ctaNewsletterHeadline = 'Jetzt Newsletter bestellen';
  const ctaNewsletterOptinText = '<p>Ich bin einverstanden, dass mich die Rheinische Post Verlagsgesellschaft mbH per E-Mail über passende Verlagsangebote (Print- und Onlineabonnements, Gewinnspiele, Veranstaltungen und RP Shop Artikel) persönlich informiert und kann dies jederzeit widerrufen (per Abmeldelink im Newsletter oder per E-Mail an leserservice@rheinischepost.de)</p><p>Die Zustimmung wird ausdrücklich als vertragliche Gegenleistung für die zur Verfügung gestellten registrierungspflichtigen Artikel und Features auf RP ONLINE (z.B. Personalisierung der Seite) vereinbart. Die Angabe einer gültigen E-Mail-Adresse ist für die Registrierung erforderlich und kann ohne sie nicht erfolgen. it der Registrierung erkläre ich mich mit dem Teilnahmebdeingungen und der Datenschutzerklärung einverstanden.</p>';

  if (isMobile) {
    origin = 'mobile';
  }

  if (isApp) {
    origin = 'app';
  }

  function isIndex() {
    return !document.classList.contains('park-embeddable-component') &&
      !!document.querySelector('.park-opener') &&
      !document.documentElement.classList.contains('is-advertorial');
  }

  function isArticle() {
    return !!document.querySelector('.park-article') &&
      !document.documentElement.classList.contains('is-advertorial');
  }

  function isReducedArticle() {
    return !!document.querySelector('.park-article--reduced');
  }

  function isFacebookSurface() {
    return window.location.href.indexOf('surface') !== -1;
  }

  function containsUserGroupActions(response) {
    return response.data &&
      response.data.user_group_actions &&
      response.data.user_group_actions.cms_snippet &&
      response.data.user_group_actions.cms_snippet.parameter;
  }

  function getNotificationConfig(url) {
    return new Promise((resolve, reject) => {
      if (!window.cre || !window.cre.cmsJsonOfferApiUrl) {
        window.park.console.error('window.cre.cmsJsonOfferApiUrl config is missing');
        reject(false);
        return;
      }

      window
        .park
        .ajax(url)
        .then(result => result.json())
        .then((result) => {
          resolve(result[0]);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  function getOfferIdsForUser(trackingId, userId) {
    return new Promise((resolve, reject) => {
      if (!window.cre || !window.cre.offerApiUrl) {
        window.park.console.error('window.cre.offerApiUrl config is missing');
        reject(false);
        return;
      }

      let url = `${window.cre.offerApiUrl}?tracking_id=${trackingId}`;
      if (userId) {
        url = `${url}&user_id=${userId}`;
      }
      window
        .park
        .ajax(url)
        .then(result => result.json())
        .then((result) => {
          const offerIds = result.data.groups.reduce((previousOfferIds, currentGroup) =>
              previousOfferIds.concat(currentGroup.offers.map(offer => offer.offer_id))
            , []);

          resolve(offerIds);
        })
        .catch(() => {
          resolve([]);
        });
    });
  }

  function getOfferIds(trackingId) {
    if (window.park.user.isLoggedIn()) {
      return window.park.user.getUser().then((user) => {
        const userid = user.userid;
        return getOfferIdsForUser(trackingId, userid);
      });
    }
    return getOfferIdsForUser(trackingId, false);
  }

  function getOfferDetails(offerId) {
    return new Promise((resolve, reject) => {
      if (!window.cre || !window.cre.cmsJsonOfferApiUrl) {
        window.park.console.error('window.cre.cmsJsonOfferApiUrl config is missing');
        reject(false);
        return;
      }

      const url = `${window.cre.cmsJsonOfferApiUrl}?id=${offerId}`;

      window
        .park
        .ajax(url)
        .then(result => result.json())
        .then((result) => {
          resolve(result[0] || {});
        });
    });
  }

  function trackOffersView(offerIds) {
    window.cre_client.set_service_id('rpo'); // Konstante
    window.cre_client.set_origin(origin);
    window.cre_client.set_entitlement_id('digital_web'); // Konstante
    window.cre_client.set_cms_id('offerpage/form/view'); // Konstante
    window.cre_client.set_content_id('offerpage/form/view'); // Konstante
    window.cre_client.set_channel('offers'); // Konstante
    window.cre_client.set_sub_channel('view');
    window.cre_client.set_doc_type('paywall');
    window.cre_client.set_offer_ids(offerIds);
    window.cre_client.request();
  }

  function buildNotice(notice, read, limit) {
    const articlesLeft = limit - read;

    let addition;
    switch (articlesLeft) {
      case 3:
        addition = 'Sie können in diesem Monat noch drei weitere Artikel gratis lesen. ';
        break;
      case 2:
        addition = 'Sie können in diesem Monat noch zwei weitere Artikel gratis lesen.';
        break;
      case 1:
        addition = 'Sie können in diesem Monat noch einen weiteren Artikel gratis lesen.';
        break;
      case 0:
        addition = 'Das ist der letzte Artikel, den Sie diesen Monat gratis lesen können.';
        break;
      // by default only return the notice message
      default:
        return notice;
    }

    return `<b>${addition}</b><br>${notice}`;
  }

  function createPaywallNotification(response, config) {
    getOfferIds(response.data.tracking_id)
      .then((offerIds) => {
        let offerId = offerIds[0];

        if (window.location.hash.indexOf('c1notification') !== -1) {
          offerId = window.location.hash.split(':')[1];
        }

        getOfferDetails(offerId)
          .then((offerConfig) => {
            if (!offerConfig.osc_url) {
              return;
            }

            const data = {
              headline: buildNotice(config.notice, response.data.count, response.data.max_count),
              text: config.more_articles_text,
              link: {
                text: offerConfig.pw_offer_subtitle,
                href: `${offerConfig.osc_url}${offerConfig.osc_url.indexOf('?') > -1 ? '&' : '?'}utm_source=rpo&utm_medium=notification&utm_campaign=${response.data.count}`,
              },
            };

            const widget = window.park.widgets.create({
              type: 'paywall-notification',
              initialState: data,
            });

            const snackbars = document.querySelector('.park-header__snackbars');

            snackbars.prepend(widget);
          });
      });
  }

  function createWidget(offerId, data) {
    const widget = window.park.widgets.create({
      type: 'paywall-article',
      initialState: data,
    });

    const articleElem = document.querySelector('.park-article--reduced');

    if (!articleElem) {
      return null;
    }

    articleElem.insertAdjacentElement('afterend', widget);
    trackOffersView([offerId]);

    return widget;
  }

  function createPaywallArticle(response, config) {
    getOfferIds(response.data.tracking_id)
      .then((offerIds) => {
        if (window.location.hash.indexOf('c1offer') !== -1) {
          const c1offer = window.location.hash.split(':')[1];
          offerIds = c1offer.split(',');
        }

        if (offerIds[0] === 'login' && !isFacebookSurface()) {
          createWidget('login', freemiumData);
          return;
        }
        if (isFacebookSurface()) {
          utmMedium = 'FBIAPaywall';
          loginUrl = '/sso/oauth?client_id=facebook-subscribe&scope=facebookIASubscribe&redirect_uri=/sso/fb_account_linking';
        }
        const offersDetailsFetching = offerIds.map(offer => getOfferDetails(offer));
        Promise.all(offersDetailsFetching).then((results) => {
          const offerListData = [];
          const offerConfig = results[0];

          results.forEach((offerConfig) => {
            offerListData.push({
              id: offerConfig.NodeID,
              name: offerConfig.pw_offer_name,
              text: offerConfig.pw_offer_text,
              price: offerConfig.price,
              priceinfo: offerConfig.priceinfo,
              priceextension: offerConfig.priceextension,
              cta: {
                text: offerConfig.pw_offer_subtitle,
                href: `${offerConfig.osc_url}${offerConfig.osc_url.indexOf('?') > -1 ? '&' : '?'}utm_source=rpo&utm_medium=${utmMedium}`,
              },
            });
          });
          if (offerListData.length > 0) {
            offerListData[0].selected = true;
          }

          const login = (!window.park.user.isLoggedIn()) ? {
            text: 'Bereits Abonnent?',
            cta: {
              text: 'Jetzt anmelden',
              href: loginUrl,
            },
          } : {};
          const text = (window.dataLayer[0].contentType === 'PlusArtikel') ? config.sub_hl_fr_wall : config.sub_hl_wall;
          const data = {
            headline: config.hl_wall,
            text,
            cta: {
              text: offerConfig.pw_offer_subtitle,
              href: `${offerConfig.osc_url}${offerConfig.osc_url.indexOf('?') > -1 ? '&' : '?'}utm_source=rpo&utm_medium=${utmMedium}`,
            },
            login,
            offers: offerListData,
            vendors: {
              subscribeWithGoogle: (!isFacebookSurface() && !window.park.user.isLoggedIn() && window.cre.subscribewithgoogle === 'true'),
            },
          };

          createWidget(offerIds[0], data);
        });
      });
  }

  function fillOfferSlots(response) {
    if (!window.cre || !window.cre.cmsJsonAlertsApiUrl) {
      window.park.console.error('window.cre.cmsJsonAlertsApiUrl config is missing');
      return;
    }

    const offerSlots = window.park.$('.park-offer-slot');

    if (!offerSlots.length) {
      window.park.console.info('Found no offer slot on the page');
      return;
    }

    const template = response.data.template_id;
    const url = `${window.cre.cmsJsonAlertsApiUrl}?template=${template}`;

    window
      .park
      .ajax(url)
      .then(result => result.json())
      .then((config) => {
        offerSlots.forEach((elem) => {
          // Skip HeaderAd in Header slot if article is checked in offer
          let position;
          try {
            position = JSON.parse(config.position).object;
          } catch (e) {
            position = {};
          }
          const isParentHeader = elem.parentNode.classList.contains('park-header__offer');
          if (isArticle() && position.article && isParentHeader) {
            window.park.storage.set('park.offer.withoutOffers', true);
            return;
          }

          const data = {
            href: config.href,
            image: config.image,
            text: config.text,
            link_text: config.link_text,
            backgroundcolor: config.backgroundcolor,
            color: config.color,
            flag_textlink: config.flag_textlink,
          };

          const widget = window.park.widgets.create({
            type: 'offer',
            initialState: data,
          });

          elem.appendChild(widget);
        });
      });
  }

  function responseHandler(response) {
    if (document.readyState === 'loading') {
      window.setTimeout(() => {
        responseHandler(response);
      }, 100);
      return;
    }

    if (isClickDummy) {
      response = {
        data: {
          type: 'offer',
        },
      };
    }

    if (!response || !response.data) {
      return;
    }

    // do we show a personalized template or a general one
    const userGroupActionTemplate = containsUserGroupActions(response);
    let notificationConfigUrl = `${window.cre.cmsJsonApiUrl}${window.cre.cmsJsonApiUrl.indexOf('?') > -1 ? '&' : '?'}template=standard`;

    if (userGroupActionTemplate) {
      notificationConfigUrl = `${window.cre.cmsJsonApiUrl}${window.cre.cmsJsonApiUrl.indexOf('?') > -1 ? '&' : '?'}template=${encodeURIComponent(userGroupActionTemplate)}`;
      // user actions always result into a reminder
      response.data.type = 'reminder';
    }
    const supressOfferVisitCount = parseInt((window.park.storage.get('park.offer.suppress') || 0), 10);

    if (isArticle()) {
      if (window.location.hash.indexOf('c1notification') !== -1) {
        response.data.type = 'reminder';
      }

      if (
        (
          window.location.hash.indexOf('c1notification') !== -1
        ) || (
          response.data.type === 'reminder' &&
          (window.park.storage.get('park.cookieConsent') === true || window.park.cookie.get('rpo-cookie-hint-disabled') === true) &&
          !(response.data.template_id && supressOfferVisitCount === 0)
        )
      ) {
        getNotificationConfig(notificationConfigUrl)
          .then((config) => {
            createPaywallNotification(response, config);
          });
      }

      if (isReducedArticle()) {
        getNotificationConfig(notificationConfigUrl)
          .then((config) => {
            createPaywallArticle(response, config);
          });
      }
    }

    let templateId = response.data.template_id;

    if (window.location.hash.indexOf('c1template') !== -1) {
      templateId = window.location.hash.split(':').slice(1).join(':');
    }

    if (templateId) {
      switch (true) {
        case templateId.startsWith('pushnotifications'):
        case templateId.startsWith('pushnotifications:general'):
          console.info('CRE: Push Notifications');
          if (
            window.park.pushNotifications &&
            !isReducedArticle()
          ) {
            window.park.pushNotifications.isSupported().then(() => {
              if (
                window.Notification &&
                window.Notification.permission &&
                window.Notification.permission !== 'default'
              ) {
                return;
              }
              fillOfferSlots(response);
            });
          }
          break;

        case templateId.startsWith('widget:'):
          (() => {
            console.info('CRE: Widget');

            if (
              !isIndex && (
                !isArticle() ||
                isReducedArticle()
              )
            ) {
              return;
            }

            const newsletterGroup = templateId.replace('widget:newsletter:', '');
            let initialState;

            switch (newsletterGroup) {
              default:
                break;

              case 'stimme-des-westens':
              case 'stimme-des-westens:optin':
                initialState = {
                  type: 'stimme-des-westens',
                  children: [
                    {
                      component: 'widget',
                      data: {
                        type: 'cta-newsletter',
                        initialState: {
                          header: {
                            headline: ctaNewsletterHeadline,
                            text: 'Vom <strong>Chefredakteur</strong> persönlich: Im kostenlosen Newsletter <strong>"Stimme des Westens"</strong> lesen Sie jeden Morgen, welche Themen die Region bewegen',
                          },
                          groupName: 'stimme-des-westens',
                          optin: newsletterGroup.indexOf(':optin') > -1 ? ctaNewsletterOptinText : undefined,
                        },
                      },
                    },
                  ],
                };
                break;

              case 'total-lokal':
              case 'total-lokal:optin':
                initialState = {
                  type: 'total-lokal',
                  children: [
                    {
                      component: 'widget',
                      data: {
                        type: 'cta-newsletter',
                        initialState: {
                          header: {
                            headline: ctaNewsletterHeadline,
                            text: 'Direkt aus der Lokalredaktion: Lesen Sie immer samstags die wichtigsten <strong>Nachrichten aus Ihrer Stadt</strong> - im kostenlosen <strong>"Total Lokal"</strong>-Newsletter',
                          },
                          groupName: 'total-lokal',
                          optin: newsletterGroup.indexOf(':optin') > -1 ? ctaNewsletterOptinText : undefined,
                        },
                      },
                    },
                  ],
                };
                break;

              case 'topnewsletter':
              case 'topnewsletter:optin':
                initialState = {
                  type: 'topnewsletter',
                  children: [
                    {
                      component: 'widget',
                      data: {
                        type: 'cta-newsletter',
                        initialState: {
                          header: {
                            headline: ctaNewsletterHeadline,
                            text: 'Bleiben Sie auf dem Laufenden: Die <strong>Topmeldungen</strong> aus Ihrer Stadt, Deutschland und der Welt - jetzt täglich im kostenlosen Newsletter',
                          },
                          groupName: 'topnewsletter',
                          optin: newsletterGroup.indexOf(':optin') > -1 ? ctaNewsletterOptinText : undefined,
                        },
                      },
                    },
                  ],
                };
                break;
            }

            if (initialState) {
              window.park.observer.initialize('.park-article__scroll-indicator + .park-article-content + *', (elem) => {
                if (!elem.matches('.park-article-content')) {
                  elem = elem.nextElementSibling;
                }

                if (
                  !elem ||
                  !elem.matches('.park-article-content') ||
                  !elem.nextElementSibling ||
                  !elem.nextElementSibling.matches('.park-article-content')
                ) {
                  return;
                }

                const widget = window.park.widgets.create({
                  type: 'suppressible',
                  initialState,
                });

                elem.parentNode.insertBefore(widget, elem.nextElementSibling);
              });

              window.park.observer.initialize('.park-opener', () => {
                window.park.observer.initialize('.park-section:first-child', (elem) => {
                  const nextSection = document.querySelector('.park-section:first-child + .park-section');
                  if (
                    nextSection &&
                    nextSection.querySelectorAll('li').length === 1 &&
                    nextSection.querySelector('.park-portal')
                  ) {
                    elem = nextSection;
                  }

                  const section = document.createElement('aside');
                  section.className = 'park-section park-section--collapsible';

                  const widget = window.park.widgets.create({
                    type: 'suppressible',
                    initialState,
                  });

                  section.appendChild(widget);

                  elem.parentNode.insertBefore(section, elem.nextElementSibling);
                });
              });
            }
          })();
          break;

        case templateId.startsWith('test:'):
          (() => {
            const testGroup = templateId.replace('test:', '');

            window.park.storage.set('park.testGroup', testGroup, true);
          })();
          break;

        case templateId.startsWith('offer:'):
        default:
          console.info('CRE: Offer');
          if (
            supressOfferVisitCount === 0 &&
            !isReducedArticle() &&
            (
              window.park.storage.get('park.cookieConsent') === true ||
              window.park.cookie.get('rpo-cookie-hint-disabled') === true
            )
          ) {
            fillOfferSlots(response);
          }
          break;
      }
    }

    window.park.storage.set('park.offer.suppress', `${Math.max(0, supressOfferVisitCount - 1)}`);
  }

  function fallbackHandler() {
    if (isClickDummy && window.location.hash.indexOf('c1template') !== -1) {
      responseHandler();
    }

    if (isArticle() && isReducedArticle() && !isFacebookSurface()) {
      createWidget('login', freemiumData);
    }
  }

  if (!window.cre || !window.cre.trackingApiUrl || !window.cre.contentid) {
    window.park.console.info('No CRE config for this specific page found');
    return;
  }

  if (!window.cre_client) {
    window.park.console.info('cre_client object is missing');
    return;
  }

  window.cre_client.set_site(window.cre.site);
  window.cre_client.set_service_id(window.cre.serviceid);
  window.cre_client.set_origin(origin);
  window.cre_client.set_cms_id(window.cre.cms_id);
  window.cre_client.set_content_id(window.cre.contentid);
  window.cre_client.set_channel(window.cre.channel);
  window.cre_client.set_sub_channel(window.cre.subchannel);

  if (window.cre.subsubchannel) {
    window.cre_client.set_sub_sub_channel(window.cre.subsubchannel);
  }

  window.cre_client.set_doc_type(window.cre.doctype);
  window.cre_client.set_kicker(window.cre.kicker);
  window.cre_client.set_heading(window.cre.heading);
  window.cre_client.set_entitlement_id(window.cre.entitlementid);

  window.cre_client.addListener(responseHandler);
  window.cre_client.addFallback(fallbackHandler);

  window.cre_client.request();
})();
