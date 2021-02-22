(() => {
  const initialCitiesInnerHTML = {};
  const initialSportsclubsInnerHTML = {};
  const isClickDummy = (
    window.park.exports &&
    window.park.exports.config &&
    window.park.exports.config.isClickDummy
  );

  window.park = Object.assign({}, window.park, {
    quickNav: {
      isLoggedIn() {
        return isClickDummy
          ? window.park.storage.get('park.user.authenticated') === 'true'
          : !!window.park.cookie.get('sso_user');
      },
    },
  });

  function appendToFragment(template, data, fragment) {
    const content = template.content || template;
    const templateItem = content.querySelector('.park-quick-nav__item');
    const templateItemHtml = templateItem.innerHTML;

    const elem = document.createElement(templateItem.nodeName.toLowerCase());
    elem.className = templateItem.className;
    elem.innerHTML = templateItemHtml;

    const link = elem.querySelector('.park-quick-nav-item');
    const icon = elem.querySelector('.park-quick-nav-item__icon');
    const text = elem.querySelector('.park-quick-nav-item__text');

    link.href = data.href;

    if (data.icon) {
      const iconSrc = data.icon.startsWith('.') ? `${window.park.exports.config.rootBase}/${data.icon}` : data.icon;

      link.classList.add('park-quick-nav-item--has-icon');
      icon.src = iconSrc;
    } else {
      link.classList.remove('park-quick-nav-item--has-icon');
      icon.parentNode.removeChild(icon);
    }

    if (typeof data.text === 'string') {
      data.text = data.text.replace(/&amp;/g, '&');
    }

    text.textContent = data.text;

    fragment.appendChild(elem);

    return fragment;
  }

  function update(elem) {
    if (!window.park.quickNav.isLoggedIn()) {
      return;
    }

    if (
      !window.park.user ||
      !window.park.user.getPreferredCities ||
      !window.park.user.getPreferredSportsclubs
    ) {
      window.setTimeout(() => {
        update(elem);
      }, 100);
      return;
    }

    const template = elem.querySelector('template');
    const promises = [
      window.park.user.getPreferredCities(),
      window.park.user.getPreferredSportsclubs(),
    ];

    Promise.all(promises)
      .then((results) => {
        // Cities
        ((result) => {
          const appendToNode = elem.querySelector('.park-quick-nav__cities');

          if (result.length === 0 || !result.forEach) {
            appendToNode.innerHTML = initialCitiesInnerHTML[appendToNode];
            return;
          }

          let fragment = document.createDocumentFragment();

          result.forEach((data) => {
            fragment = appendToFragment(template, data, fragment);
          });

          appendToNode.innerHTML = '';
          appendToNode.appendChild(fragment);
        })(results[0]);

        // Sportsclubs
        ((result) => {
          const appendToNode = elem.querySelector('.park-quick-nav__sportsclubs');

          if (result.length === 0 || !result.forEach) {
            appendToNode.innerHTML = initialSportsclubsInnerHTML[appendToNode];
            return;
          }

          let fragment = document.createDocumentFragment();

          result.forEach((data) => {
            fragment = appendToFragment(template, data, fragment);
          });

          appendToNode.innerHTML = '';
          appendToNode.appendChild(fragment);
        })(results[1]);

        elem.classList.add('park-quick-nav--is-done');
      })
      .catch((e) => {
        window.park.console.error(e);
        elem.classList.add('park-quick-nav--is-done');
      });
  }

  window.park.observer.initialize('.park-quick-nav--personalized', (elem) => {
    const elemCities = elem.querySelector('.park-quick-nav__cities');
    const elemSportsclubs = elem.querySelector('.park-quick-nav__sportsclubs');

    initialCitiesInnerHTML[elemCities] = elemCities.innerHTML;
    initialSportsclubsInnerHTML[elemSportsclubs] = elemSportsclubs.innerHTML;

    document.addEventListener('park.user:authchange', () => {
      update(elem);
    });

    if (!window.park.quickNav.isLoggedIn()) {
      elem.classList.add('park-quick-nav--is-done');
    } else {
      update(elem);
    }
  }, false);
})();
