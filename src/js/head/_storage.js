(() => {
  /* eslint-disable no-storage/no-browser-storage */
  let inkognitoMode = false;
  let timer;

  try {
    window.localStorage.setItem('park.testInkognitoMode', 'true');
    window.localStorage.getItem('park.testInkognitoMode');
    window.localStorage.removeItem('park.testInkognitoMode');
  } catch (e) {
    inkognitoMode = true;
  }

  function keys(useSessionStorage) {
    if (useSessionStorage) {
      return Object.keys(window.sessionStorage);
    }
    return Object.keys(window.localStorage);
  }

  function set(key, value, useSessionStorage) {
    if (inkognitoMode) {
      return false;
    }

    switch (typeof value) {
      default:
        return false;

      case 'number':
      case 'string':
        break;

      case 'boolean':
      case 'object':
        value = JSON.stringify(value);
    }

    if (useSessionStorage) {
      window.sessionStorage.setItem(key, value);
    } else {
      window.localStorage.setItem(key, value);
    }

    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (window.park.eventHub) {
        window.park.eventHub.trigger(window, 'storage');
      }
    }, 100);

    return true;
  }

  function get(key, useSessionStorage) {
    if (inkognitoMode) {
      return null;
    }

    let value;

    try {
      if (useSessionStorage) {
        value = window.sessionStorage.getItem(key);
      } else {
        value = window.localStorage.getItem(key);
      }
    } catch (e) {
      return null;
    }

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  function remove(key, useSessionStorage) {
    if (inkognitoMode) {
      return false;
    }

    try {
      if (useSessionStorage) {
        window.sessionStorage.removeItem(key);
      } else {
        window.localStorage.removeItem(key);
      }

      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (window.park.eventHub) {
          window.park.eventHub.trigger(window, 'storage');
        }
      }, 100);

      return true;
    } catch (e) {
      return false;
    }
  }

  window.park = Object.assign({}, window.park, {
    storage: {
      disabled: inkognitoMode,
      keys,
      set,
      get,
      remove,
    },
  });
})();
