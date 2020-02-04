(() => {
  let trackingId;
  let offerIds = [];
  let maxCount = 1000000;
  let count = 0;
  const requiredParams = [
    'site',
    'serviceid',
    'origin',
    'cms_id',
    'contentid',
    'subchannel',
    'doctype',
    'kicker',
    'heading',
    'entitlementid',
  ];

  function createKeyValueMap(customData) {
    const keyValueMap = {};

    requiredParams.forEach((param) => {
      keyValueMap[param] = encodeURIComponent(window.cre[param]);
    });

    Object.assign(keyValueMap, customData || {});

    return keyValueMap;
  }

  function createKeyValueArray(customData) {
    const keyValueMap = createKeyValueMap(customData);

    return Object.keys(keyValueMap).map(key => `${key}=${keyValueMap[key]}`);
  }

  function createQueryString(customData) {
    const keyvaluePairs = createKeyValueArray(customData);

    return keyvaluePairs.join('&');
  }

  function getTrackingData() {
    return new Promise((resolve, reject) => {
      if (!window.cre || !window.cre.trackingApiUrl) {
        window.park.console.error('window.cre.trackingApiUrl config is missing');
        reject(false);
        return;
      }

      const queryString = createQueryString({
        _u: encodeURIComponent(window.location),
      });
      const url = `${window.cre.trackingApiUrl}?${queryString}`;

      window
        .park
        .ajax(url, {
          jsonp: '_c',
        })
        .then(result => result.response())
        .then((result) => {
          resolve(result);
        });
    });
  }

  function getOffers(trackingId) {
    return new Promise((resolve, reject) => {
      if (!window.cre || !window.cre.offerApiUrl) {
        window.park.console.error('window.cre.offerApiUrl config is missing');
        reject(false);
        return;
      }

      const url = `${window.cre.offerApiUrl}?tracking_id=${trackingId}`;

      window
        .park
        .ajax(url)
        .then(result => result.json())
        .then((result) => {
          resolve(result);
        })
        .catch(() => {
          // Dummy data for when CORS is not activated
          resolve({
            status: 'ok',
            data: {
              config: {
                templateVariant: 'standard',
                variant: 'standard',
                rule_free_text: null,
                deviceClass: null,
                osType: null,
                attributes: {
                  abtestvariantid: '',
                  content_variant: 'not_configured',
                  abtestid: '',
                  disrupter: null,
                },
                channel: 'web',
              },
              groups: [
                {
                  offers: [
                    {
                      stores: [
                        {
                          valid_from: 0,
                          store_id: 'RP',
                          contained_products: [
                            {
                              product_id: 'product_E-RP-EPAB-NP',
                            },
                          ],
                          price: 30,
                          valid_to: 2145913199000,
                          products: [
                            'product_E-RP-EPAB-NP',
                          ],
                          details: {
                            cms_data: {
                              'product_E-RP-EPAB-NP': 'PW_EPAB_1JNO',
                            },
                            node_id: '26237',
                          },
                        },
                      ],
                      offer_id: 'offer_26237_E-RP-EPAB-NP',
                      config: {
                        attributes: {
                          disrupter: 'standard',
                        },
                        variant: 'standard',
                      },
                      description: 'Erstes Jahr 30,00 € danach monatlich 4,99 €',
                      name: 'offer_26237_E-RP-EPAB-NP',
                    },
                  ],
                  config: {
                    attributes: {
                      variant: '',
                      disrupter: null,
                    },
                    variant: '',
                  },
                },
                {
                  offers: [
                    {
                      stores: [
                        {
                          valid_from: 0,
                          store_id: 'RP',
                          contained_products: [
                            {
                              product_id: 'product_E-RP-EARG-NP',
                            },
                          ],
                          price: 0.99,
                          valid_to: 2145913199000,
                          products: [
                            'product_E-RP-EARG-NP',
                          ],
                          details: {
                            cms_data: {
                              'product_E-RP-EARG-NP': 'E-RP_EARG_1NNOR',
                            },
                            node_id: '9344',
                          },
                        },
                      ],
                      offer_id: 'offer_9344_E-RP-EARG-NP',
                      config: {
                        attributes: {
                          disrupter: 'standard',
                        },
                        variant: 'standard',
                      },
                      description: 'Erster Monat 0,99 € danach 21,90 €',
                      name: 'offer_9344_E-RP-EARG-NP',
                    },
                  ],
                  config: {
                    attributes: {
                      variant: '',
                      disrupter: null,
                    },
                    variant: '',
                  },
                },
                {
                  offers: [
                    {
                      stores: [
                        {
                          valid_from: 0,
                          store_id: 'RP',
                          contained_products: [
                            {
                              product_id: 'product_E-RP-EPTP-NP',
                            },
                          ],
                          price: 0.99,
                          valid_to: 2145913199000,
                          products: [
                            'product_E-RP-EPTP-NP',
                          ],
                          details: {
                            cms_data: {
                              'product_E-RP-EPTP-NP': 'PW E-RP_EPAB_TP',
                            },
                            node_id: '7607',
                          },
                        },
                      ],
                      offer_id: 'offer_7607_E-RP-EPTP-NP',
                      config: {
                        attributes: {
                          disrupter: 'standard',
                        },
                        variant: 'standard',
                      },
                      description: '1 Tag RP ONLINE Vollzugriff',
                      name: 'offer_7607_E-RP-EPTP-NP',
                    },
                  ],
                  config: {
                    attributes: {
                      variant: '',
                      disrupter: null,
                    },
                    variant: '',
                  },
                },
              ],
            },
          });
        });
    });
  }

  function getOfferDetails(offerId) {
    return new Promise((resolve, reject) => {
      if (!window.cre || !window.cre.oscJsonOfferApiUrl) {
        window.park.console.error('window.cre.oscJsonOfferApiUrl config is missing');
        reject(false);
        return;
      }

      const url = `${window.cre.oscJsonOfferApiUrl}?id=${offerId}`;

      window
        .park
        .ajax(url)
        .then(result => result.json())
        .then((result) => {
          resolve(result);
        });
    });
  }

  function trackOfferView() {
    const queryString = createQueryString({
      subchannel: 'view',
      doctype: 'paywall',
      offerids: offerIds,
    });

    keyvaluePairs.push(`_u=${encodeURIComponent(window.location)}`);

    trackOffersView = function (trackingResponse) {
      // DISPLAY AN OFFER
      if (paywall.util.displayOffer(trackingResponse)) {
        cre_client.set_service_id("rpo"); // Konstante
        if (paywall.config.isMobile) { // web, mobile, app oder tv
          cre_client.set_origin("mobile");
        } else {
          cre_client.set_origin("web");
        }
        cre_client.set_entitlement_id("digital_web"); // Konstante
        cre_client.set_cms_id("offerpage/form/view"); // Konstante
        cre_client.set_content_id("offerpage/form/view"); // Konstante
        cre_client.set_channel("offers"); // Konstante
        cre_client.set_sub_channel("view");
        cre_client.set_doc_type("paywall");
        cre_client.set_offer_ids(paywall.getOfferIds(paywall.trackingResponse));
        cre_client.request();
      }
    };
  }

  window.park = Object.assign({}, window.park, {
    cre: {
      ping: () => {
        if (!window.cre || !window.cre.trackingApiUrl || !window.cre.contentid) {
          window.park.console.info('No CRE config for this specific page found');
          return;
        }

        getTrackingData()
          .then((result) => {
            console.log(result);

            trackingId = result.data.tracking_id;
            maxCount = result.data.max_count;
            count = result.data.count;

            return getOffers(trackingId);
          })
          .then((result) => {
            console.log(result);

            offerIds = result.data.groups.reduce((previousOfferIds, currentGroup) =>
                previousOfferIds.concat(currentGroup.offers.map(offer => offer.offer_id))
              , []);

            console.log(offerIds);

            const offerId = offerIds[0];

            return getOfferDetails(offerId);
          })
          .then((result) => {
            console.log(result);
          });
      },
    },
  });

  window.park.cre.ping();
})();
