(() => {
  function reducer(state, action) {
    let elem;

    switch (action.type) {
      case 'UPDATE':
      case 'APPEND':
        elem = action.value.elem;

        delete action.value.elem;

        window.park.eventHub.trigger(document, 'park.search:displayresults', {
          elem,
          state,
        });
        break;

      default:
        break;
    }

    switch (action.type) {
      case 'UPDATE':
        state = action.value;
        break;

      case 'APPEND':
        state.items = (state.items || []).concat(action.value.items);
        state.disableMoreButton = action.value.disableMoreButton;
        state.page = action.value.page;
        break;

      default:
        break;
    }

    return state;
  }

  window.park.app({
    container: 'search',
    component: 'search',
    reducer,
  }).then((app) => {
    const url = `${window.park.exports.config.rootBase}${app.store.getState().ajax.url}`;

    app.bindEvent('change', 'input[type="radio"], input[type="checkbox"]', (e) => {
      const elem = e.target.closest('.park-search');
      const value = e.target.parkValue || e.target.value;
      const checked = e.target.checked;

      window.park.ajax(url, {
        method: 'POST',
        form: e.target.closest('form'),
      })
        .then(result => result.json())
        .then((response) => {
          // Force to type with value
          if (!response.items.length && response.form.typeOptions.length > 0) {
            console.log(`force type to ${response.form.typeOptions[0].value} and make a new request`);
            const searchForm = document.querySelector('.park-search form');
            searchForm.querySelector(`input[value="${response.form.typeOptions[0].value}"]`).checked = true;
            return window.park.ajax(url, {
              method: 'POST',
              form: searchForm,
            }).then(result => result.json());
          }
          return response;
        })
        .then((response) => {
          const form = JSON.parse(JSON.stringify(app.store.getState())).form;

          form.sortOptions.forEach((option) => {
            if (option.value === value) {
              if (checked) {
                form.sortValue = value;
              } else {
                form.sortValue = undefined;
              }
            }
          });

          [
            'months',
            'ressorts',
          ].forEach((optionSet) => {
            form[`${optionSet}Options`].forEach((option) => {
              if (option.value === value) {
                const index = form[`${optionSet}Value`].indexOf(value);

                if (checked) {
                  if (index === -1) {
                    form[`${optionSet}Value`].push(value);
                  }
                } else if (index > -1) {
                  form[`${optionSet}Value`].splice(index, 1);
                }
              }
            });
          });

          form.typeOptions = response.form.typeOptions;
          form.typeValue = response.form.typeValue;

          app.store.dispatch({
            type: 'UPDATE',
            value: {
              elem,
              form,
              items: response.items,
              disableMoreButton: !!response.disableMoreButton,
              page: 1,
            },
          });
        });
    });

    app.bindEvent('click', '.park-search__more-results-button .park-button', (e) => {
      const elem = e.target.closest('.park-search');
      const form = elem.querySelector('.park-form');
      const formData = window.park.getFormData(form);
      const currentState = app.store.getState();
      const nextPage = (currentState.page || 1) + 1;

      formData.append('page', nextPage);

      window.park.ajax(url, {
        method: 'POST',
        body: formData,
      })
        .then(result => result.json())
        .then((response) => {
          app.store.dispatch({
            type: 'APPEND',
            value: {
              elem,
              items: response.items,
              disableMoreButton: !!response.disableMoreButton,
              page: nextPage,
            },
          });
        });
    });

    /* Google Adsense Custom Search Ads */

    /* eslint-disable */
    (function (G, o, O, g, L, e) {
      G[g] = G[g] || function () {
        (G[g]['q'] = G[g]['q'] || []).push(
          arguments)
      }, G[g]['t'] = 1 * new Date;
      L = o.createElement(O), e = o.getElementsByTagName(
        O)[0];
      L.async = 1;
      L.src = '//www.google.com/adsense/search/async-ads.js';
      e.parentNode.insertBefore(L, e)
    })(window, document, 'script', '_googCsa');

    /* eslint-enable */

    function updateAds(elem) {
      const ads = window.park.$('.park-search-adsense[data-page-options]', elem);

      ads.forEach((elem) => {
        const pageOptions = JSON.parse(elem.getAttribute('data-page-options'));
        const brandColor = window.getComputedStyle(document.documentElement, ':before').getPropertyValue('color');
        let unitOptions;

        if (!window.park.device.isMobile()) {
          /* Desktop */
          unitOptions = {
            container: elem,
            number: 1,
            width: `${elem.offsetWidth}px`,
            fontFamily: 'arial, helvetica neue, roboto',
            fontSizeTitle: 18,
            titleBold: true,
            noTitleUnderline: true,
            lineHeightTitle: 24,
            fontSizeDescription: 18,
            lineHeightDescription: 24,
            fontSizeDomainLink: 18,
            lineHeightDomainLink: 24,
            colorTitleLink: brandColor,
            colorDescriptionLink: '#000',
            colorDomainLink: '#000',
            colorBackground: '#edf0f3',
          };
        } else {
          /* Mobile */
          unitOptions = {
            container: elem,
            number: 1,
            width: `${elem.offsetWidth}px`,
            fontFamily: 'arial, helvetica neue, roboto',
            fontSizeTitle: 15,
            titleBold: true,
            noTitleUnderline: true,
            lineHeightTitle: 22,
            fontSizeDescription: 15,
            lineHeightDescription: 22,
            fontSizeDomainLink: 15,
            lineHeightDomainLink: 22,
            colorTitleLink: brandColor,
            colorDescriptionLink: '#000',
            colorDomainLink: '#000',
            colorBackground: '#edf0f3',
          };
        }

        pageOptions.pubId = window.park.exports.config.keys.googleAdSenseCustomSearchAdsPubId;
        pageOptions.hl = 'de';
        pageOptions.adtest = ['localhost', 'templates.park.works'].indexOf(location.host) > -1 ? 'on' : 'off';

        // eslint-disable-next-line
        window._googCsa('ads', pageOptions, unitOptions);
      });
    }

    app.elems.forEach(elem => updateAds(elem));
    app.bindEvent('park.widget:rendered', (e) => {
      const elem = e.target;

      updateAds(elem);
    });
  });
})();
