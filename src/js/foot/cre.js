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

  let widgetAlreadyInserted;

  function param(key) {
    const paramsQuery = decodeURIComponent(window.location.search.substring(1));
    const paramsArray = paramsQuery.split('&');
    let paramsValue = false;

    paramsArray.forEach((param) => {
      const paramName = param.split('=');
      if (paramName[0] === key) {
        paramsValue = paramName[1] === undefined ? true : decodeURIComponent(paramName[1]);
      }
    });
    return paramsValue;
  }

  function translateLiterals(data, translation) {
    Object.entries(translation).forEach(([pattern, replacement]) => {
      data = data.replace(pattern, replacement);
    });

    return data;
  }

  if (Object.keys(window.creExternalData).length === 0) {
    // TODO Check whether this can be raised to 'error' (multitenancy?)
    window.park.console.info('No CRE ExternalData present or configured');
    return;
  }

  let origin = 'web';
  let utmMedium = 'paywall';
  const utmSource = window.creExternalData.utmData.utmSource;
  let loginUrl = '/sso/login';

  let utmCampaign = param('utm_campaign') || '';
  if (param('utm_source') && !param('utm_campaign')) {
    utmCampaign = param('utm_source');
  }
  const utmCampaignParam = utmCampaign ? `&utm_campaign=${utmCampaign}` : '';

  const transTable = {
    '{utmSource}': utmSource,
    '{utmMedium}': utmMedium,
    '{utmCampaignParam}': utmCampaignParam,
  };
  window.creExternalData.freemiumData.cta.href = translateLiterals(
    window.creExternalData.freemiumData.cta.href, transTable
  );
  const freemiumData = window.creExternalData.freemiumData;
  const fallBackOffers = window.creExternalData.fallbackOffers;
  const fallBackOffersMeta = window.creExternalData.fallbackOffersMeta;

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

  function isPayedContent() {
    return (!!document.querySelector('.park-article') && !document.documentElement.classList.contains('is-advertorial'))
      || !!document.querySelector('.park-video-with-caption')
      || !!document.querySelector('.park-gallery');
  }

  function isReducedPayedContent() {
    return !!document.querySelector('.park-article--reduced')
      || !!document.querySelector('.park-video--reduced')
      || !!document.querySelector('.park-gallery--reduced');
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
          [window.cre.retrievedOfferData] = result.data.groups;
          let offerIds = result.data.groups.reduce((previousOfferIds, currentGroup) =>
              previousOfferIds.concat(currentGroup.offers.map(offer => offer.offer_id))
            , []);

          if (!offerIds.length) {
            offerIds = fallBackOffers;
          }
          resolve(offerIds);
        })
        .catch(() => {
          resolve(fallBackOffers);
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
    const trackingSettings = window.creExternalData.offerTracking;

    window.cre_client.set_service_id(trackingSettings.service_id);
    window.cre_client.set_origin(origin);
    window.cre_client.set_entitlement_id(trackingSettings.entitlement_id);
    window.cre_client.set_cms_id(trackingSettings.cms_id);
    window.cre_client.set_content_id(trackingSettings.content_id);
    window.cre_client.set_channel(trackingSettings.channel);
    window.cre_client.set_sub_channel(trackingSettings.sub_channel);
    window.cre_client.set_doc_type(trackingSettings.doc_type);
    window.cre_client.set_offer_ids(offerIds);
    window.cre_client.request();
  }

  function trackOffer(offerIds) {
    const trackingSettings = window.creExternalData.offerTracking;
    const variantIds = [];
    const disrupterIds = [];

    window.cre.retrievedOfferData.offers.forEach((offer) => {
      variantIds.push(offer.config.variant);
      disrupterIds.push(offer.config.attributes.disrupter);
    });

    window.cre_client.set_service_id(trackingSettings.service_id);
    window.cre_client.set_origin(origin);
    window.cre_client.set_entitlement_id(trackingSettings.entitlement_id);
    window.cre_client.set_cms_id('/offer/view');
    window.cre_client.set_content_id('/offer/view');
    window.cre_client.set_channel(trackingSettings.channel);
    window.cre_client.set_sub_channel(trackingSettings.sub_channel);
    window.cre_client.set_doc_type(trackingSettings.doc_type);
    window.cre_client.set_offer_ids(offerIds);

    window.cre_client.set_site(window.cre.site);
    window.cre_client.set_variant_ids(variantIds.join());
    window.cre_client.set_disrupter_ids(disrupterIds.join());

    window.cre_client.request();
  }

  function buildNotice(notice, read, limit, weekly) {
    const articlesLeft = limit - read;
    let timerange = (weekly) ? 'dieser Woche' : 'diesem Monat';

    let addition;
    switch (articlesLeft) {
      case 3:
        addition = `Sie können in ${timerange} noch drei weitere Artikel gratis lesen.`;
        break;
      case 2:
        addition = `Sie können in ${timerange} noch zwei weitere Artikel gratis lesen.`;
        break;
      case 1:
        addition = `Sie können in ${timerange} noch einen weiteren Artikel gratis lesen.`;
        break;
      case 0:
        timerange = (weekly) ? 'diese Woche' : 'diesen Monat';
        addition = `Das ist der letzte Artikel, den Sie ${timerange} gratis lesen können.`;
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
            const weekly = config.url_alt_offer_text.includes('Woche') || window.location.hash.includes('Woche');

            const data = {
              headline: buildNotice(offerConfig.pw_offer_name, response.data.count,
                response.data.max_count, weekly),
              text: '',
              link: {
                text: offerConfig.pw_offer_subtitle,
                href: `${offerConfig.osc_url}${offerConfig.osc_url.indexOf('?') > -1 ? '&' : '?'}utm_source=${utmSource}&utm_medium=notification${utmCampaignParam}`,
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

  function createWidget(offerIds, data) {
    const widget = window.park.widgets.create({
      type: 'paywall-article',
      initialState: data,
    });

    const reducedElem = document.querySelector('[class*="--reduced"]');

    if (!reducedElem) {
      return null;
    }

    reducedElem.insertAdjacentElement('afterend', widget);

    trackOffersView([offerIds[0]]);
    trackOffer(offerIds);

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
                href: `${offerConfig.osc_url}${offerConfig.osc_url.indexOf('?') > -1 ? '&' : '?'}utm_source=${utmSource}&utm_medium=${utmMedium}${utmCampaignParam}`,
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
              href: `${offerConfig.osc_url}${offerConfig.osc_url.indexOf('?') > -1 ? '&' : '?'}utm_source=${utmSource}&utm_medium=${utmMedium}${utmCampaignParam}`,
            },
            login,
            offers: offerListData,
            vendors: {
              subscribeWithGoogle: (!isFacebookSurface() && !window.park.user.isLoggedIn() && window.cre.subscribewithgoogle === 'true'),
            },
          };

          createWidget(offerIds, data);
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
          if (isPayedContent() && position.article && isParentHeader) {
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

    if (isPayedContent()) {
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

      if (isReducedPayedContent()) {
        getNotificationConfig(notificationConfigUrl)
          .then((config) => {
            createPaywallArticle(response, config);
          });
      }
    }

    let templateId = response.data.template_id;

    if (window.location.hash.indexOf('c1template') !== -1) {
      templateId = window.location.hash.split(':').slice(1).join(':');
      response.data.template_id = templateId;
    }

    let actionGroupsParameter = [];

    if (response.data.action_groups &&
      response.data.action_groups.cms_snippet &&
      response.data.action_groups.cms_snippet.parameters) {
      actionGroupsParameter = response.data.action_groups.cms_snippet.parameters;
    }

    window.dataLayer[0].actionGroups = {};

    for (let i = 0; i < actionGroupsParameter.length; i += 1) {
      if (actionGroupsParameter[i].startsWith('segment:')) {
        const segmentGroup = actionGroupsParameter[i].replace('segment:', '');
        window.dataLayer[0].actionGroups.segment = segmentGroup;
      } else if (actionGroupsParameter[i].startsWith('abonnement:')) {
        const abonnementGroup = actionGroupsParameter[i].replace('abonnement:', '');
        window.dataLayer[0].actionGroups.abonnement = abonnementGroup;
      } else {
        actionGroupsParameter[i] = actionGroupsParameter[i].replace('celeraone:', '');
        if (window.dataLayer[0].actionGroups.other) {
          window.dataLayer[0].actionGroups.other = `${window.dataLayer[0].actionGroups.other}|${actionGroupsParameter[i]}`;
        } else {
          window.dataLayer[0].actionGroups.other = actionGroupsParameter[i];
        }
      }
    }

    if (templateId) {
      switch (true) {
        case templateId.startsWith('pushnotifications'):
          console.info('CRE: Push Notifications');
          if (
            window.park.pushNotifications &&
            !isReducedPayedContent()
          ) {
            window.park.pushNotifications.isSupported().then(() => {
              if (
                window.Notification &&
                window.Notification.permission &&
                window.Notification.permission !== 'default'
              ) {
                return;
              }
              // fillOfferSlots(response);
              window.park.eventHub.trigger(document, `park.${templateId}`);
            });
          }
          break;

        case templateId.startsWith('widget:'):
          (() => {
            console.info('CRE: Widget');

            if (
              !isIndex && (
                !isPayedContent() ||
                isReducedPayedContent()
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
                  if (widgetAlreadyInserted) {
                    return;
                  }
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
                  widgetAlreadyInserted = true;
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
            !isReducedPayedContent() &&
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

  function fallBackOffersData() {
    const login = (!window.park.user.isLoggedIn()) ? {
      text: 'Bereits Abonnent?',
      cta: {
        text: 'Jetzt anmelden',
        href: loginUrl,
      },
    } : {};

    const offerListData = [];

    Object.keys(fallBackOffers).forEach((offer) => {
      offerListData.push({
        id: offer,
        name: fallBackOffers[offer].pw_offer_name,
        text: fallBackOffers[offer].pw_offer_text,
        price: fallBackOffers[offer].price,
        priceinfo: fallBackOffers[offer].priceinfo,
        priceextension: fallBackOffers[offer].priceextension,
        cta: {
          text: fallBackOffers[offer].pw_offer_subtitle,
          href: `${fallBackOffers[offer].osc_url}${fallBackOffers[offer].osc_url.indexOf('?') > -1 ? '&' : '?'}utm_source=${utmSource}&utm_medium=${utmMedium}${utmCampaignParam}`,
        },
      });
    });

    if (offerListData.length > 0) {
      offerListData[0].selected = true;
    }

    return {
      headline: fallBackOffersMeta.hl_wall,
      text: fallBackOffersMeta.sub_hl_fr_wall,
      cta: {
        text: offerListData[0].cta.text,
        href: offerListData[0].cta.href,
      },
      login,
      offers: offerListData,
      vendors: {
        subscribeWithGoogle: (!isFacebookSurface() && !window.park.user.isLoggedIn() && window.cre.subscribewithgoogle === 'true'),
      },
    };
  }

  function fallbackHandler() {
    if (isClickDummy && window.location.hash.indexOf('c1template') !== -1) {
      responseHandler();
    }

    if (isPayedContent() && isReducedPayedContent() && !isFacebookSurface()) {
      createWidget('login', fallBackOffersData());
    }
  }

  if (!window.cre || !window.cre.trackingApiUrl || !window.cre.contentid) {
    // TODO Check whether this can be raised to 'error' (multitenancy?)
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
