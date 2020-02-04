/* eslint-disable */
// TODO: Re-enable eslint and fix errors
(() => {
  window.park.app({
    container: 'paywall-article',
    component: 'article-paywall',
  }).then((app) => {
  // Save the URL for one hour so the user can return back to the article after the Abo-Shop order.
    const locationUrl = window.location.href.split("?")[0];
    window.park.cookie.set('rpo-last-article', locationUrl, 3600);
    window.park.cookie.set('redirect_after_login', locationUrl, 3600);

    app.bindEvent('change', '.park-article-paywall__wrapper .park-input__input', (e) => {
      const elem = e.target;
      const selectedOfferData = JSON.parse(elem.closest('.park-article-paywall_option').getAttribute('data-offer'));
      elem.closest('.park-article-paywall').querySelector('.park-button').text = selectedOfferData.cta.text;
      elem.closest('.park-article-paywall').querySelector('.park-button').href = selectedOfferData.cta.href;
    });

    const logEvent = (message) => {
        window.park.console.log(`Subscribe With Google: ${message}`);
        window.park.eventHub.trigger(document, `park.paywall-swg:${message}`);
    }

    const showContent = () => {
      logEvent('showContent');
      window.location.replace(`https://${window.location.hostname}${window.location.pathname}`);
    };
    /**
     * Check to see if there is an account associated with the given subscriptionToken
     * @param {string} entitlementsRaw returned by the swg entitlements check
     * @returns {Promise}
     */
    const c1PurchaseTokenLookup = (entitlementsToken) => {
      logEvent('c1-api:purchaseTokenLookup');
      const options = { method: 'post', body: `{ "entitlements_token" : "${entitlementsToken}" }` };
      return window.park.ajax('/cre-1.0/cip/fetch/swg/purchase_token/xhr', options)
      .then(result => result.json())
      .then((result) => { if(result.data.stored){
        return true;
      }else{
        return false;
      } });
    };

    const c1CreateSubscription = (entitlementsToken, idToken ) => {
      logEvent('sso-api:connectbyidtoken');
      const options = { method: 'post', headers: {'X-Requested-With': 'XMLHttpRequest'}, body: `{ "entitlements_token" : "${entitlementsToken}", "id_token" : "${idToken}", "service_id": "rpo", "store_id": "RP" }` };
      return window.park.ajax('/cre-1.0/cip/purchase/swg/xhr', options).then(result => result.json());
    }

    //RETURN Promise with USERID
    const ssoConnectBySwgPurchaseToken = (entitlementsRaw) => {
      logEvent('sso-api:connectbyswgpurchasetoken');
      const options = { method: 'post', headers: {'Content-Type': 'application/json'}, body: `{ "entitlements_token" : "${entitlementsRaw}" }` };
      return window.park.ajax('/auth/google/connectByPurchaseToken', options).then(result => result.json());
    }

    //RETURN Promise with USERID
    const ssoConnectByIdToken = (idToken) => {
      logEvent('sso-api:connectbyidtoken');
      const options = { method: 'post', body: `{ "idToken" : "${idToken}" }` };
      return window.park.ajax('/auth/google/connectByIdToken', options).then(result => result.json());
    }

    if(!park.user.isLoggedIn()){
    window.park.resourceLoader.script('https://news.google.com/swg/js/v1/swg.js');
    (window.SWG = window.SWG || []).push((subscriptions) => {

      const subscribeResponse = (subscriptionPromise) => {
        subscriptionPromise.then((response) => {
          console.log('subscribeResponse');
          console.log(response);
          // create the local account
          ssoConnectByIdToken(response.userData.idToken).then((ssoAccountResponse) => {
            logEvent('c1:createsubscription');
            c1CreateSubscription(response.entitlements.raw, response.userData.idToken).then((c1SubscriptionResponse) => {
              response.complete().then(() => {
                showContent();
              });
            });
          });


        });
      };

      const entitlementsResponse = (entitlementsPromise) => {
        entitlementsPromise.then((entitlements) => {
          // Handle the entitlements.
          logEvent('entitlement-check:response');
          console.log(entitlements);

            // Google returns a subscription
          if (entitlements.enablesAny()) {
            const accountLookupPromise = c1PurchaseTokenLookup(entitlements.raw);
            subscriptions.waitForSubscriptionLookup(accountLookupPromise).then((account) => {
              console.log('WAIT2');
              if (account) {
                logEvent('entitlement-check:account-found');

                 subscriptions.showLoginPrompt().then(() => {
                  logEvent('login-flow:consent');

                  subscriptions.showLoginNotification().then(() => {
                    ssoConnectBySwgPurchaseToken(entitlements.raw).then( (result) => {
                      if(result.status === 'ok'){
                        logEvent('login-flow:success');
                        showContent();
                      }else{
                        logEvent('login-flow:error');
                        window.location.href(`/sso/login`);
                        console.error(result);
                      }
                    });
                  });
                }, (reason) => {
                  // User clicked 'No'. Publisher can decide how to handle this situation.
                  logEvent('login-flow:no-content');
                  console.log(reason);
                });

              } else {
                logEvent('entitlement-check:no-account');

                subscriptions.completeDeferredAccountCreation({entitlements: entitlements, consent: true})
                  .then(function(response) {
                    logEvent('deffered-account-creation:consent');

                    ssoConnectByIdToken(response.userData.idToken).then((ssoAccountResponse) => {
                      logEvent('deffered-account-creation:account-created');

                      c1CreateSubscription(response.entitlements.raw, response.userData.idToken).then((c1SubscriptionResponse) => {
                        logEvent('deffered-account-creation:subscription-created');

                        response.complete().then(() => {
                            logEvent('deffered-account-creation:response-complete');
                            showContent();
                        });
                      });
                    });


                  });
              }
            });


              // C1: LookupPurchaseToken
             /* c1PurchaseTokenLookup(entitlements.raw).then((result) => {
                if(result.status === "ok"){
                  //Subscribtion found
                  //Login into account
                  console.log('TODO: SUBSCRITION FOUND, PROMT TO LOGIN');
                  //subscriptions.showLoginPrompt
                  console.log('TODO: HIDE PAYWALL');
                }else{
                  //Subsction not found, create new Account
                  console.log('TODO: SUBSCRITION NOT FOUND, CREATE A NEW ACCOUNT (DAC)');
                  //completeDeferredAccountCreation
                  console.log('TODO: HIDE PAYWALL');
                }
              });*/
          } else {
            logEvent('entitlement-check:no-subscription');
          }
        });
      };

      subscriptions.setOnSubscribeResponse(subscribeResponse);
      subscriptions.setOnEntitlementsResponse(entitlementsResponse);
      subscriptions.setOnLoginRequest(() => {
        logEvent('account-linking:start');
        subscriptions.linkAccount();
      });
      subscriptions.setOnLinkComplete(() => {
        logEvent('account-linking:complete');
        showContent();
      });

      window.buttonAction = () => {
        logEvent('button:clicked');

        console.log('action button clicked 2');
        subscriptions.showOffers({ isClosable: true });
      };
    });
    }

  });
})();
