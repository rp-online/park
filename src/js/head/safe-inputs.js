/* 'pt-field' - GERAWZZVA-195 - Integration PaidTime für WZ Website */
/* '#wz_optin_form input' - GERACM-6892 WZ.de / Newsletter-Formular mit Problemen */

(() => {
  let parkValue;
  const selectorWhitelist = ['pt-field input', '#wz_optin_form input', '#onetrust-group-container input', '#mo_page input'];
  const whitelistSelector = (selector) => {
    selectorWhitelist.push(selector);
  };

  try {
    parkValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  } catch (e) {
    window.park.console.info('Unable to store parkValue');
  }

  try {
    Object.defineProperty(HTMLInputElement.prototype, 'parkValue', {
      get() {
        if (!parkValue.get || !parkValue.get.call) {
          return '';
        }
        return parkValue.get.call(this);
      },
    });
  } catch (e) {
    window.park.console.info('Unable to add getter for parkValue property to HTMLInputElement.prototype');
  }

  try {
    Object.defineProperty(HTMLInputElement.prototype, 'value', {
      get() {
        if (this.matches) {
          const selectorWhitelistLength = selectorWhitelist.length;
          let i = 0;

          for (; i < selectorWhitelistLength; i += 1) {
            const selector = selectorWhitelist[i];

            if (this.matches(selector)) {
              return parkValue.get.call(this);
            }
          }
        }

        window.park.console.info('A script just tried to access an input\'s value ', this);
        console.trace();
        return '';
      },
    });
  } catch (e) {
    window.park.console.info('Unable to alter HTMLInputElement.prototype\'s value property');
  }

  window.park = Object.assign({}, window.park, {
    safeInputs: {
      whitelistSelector,
    },
  });
})();
