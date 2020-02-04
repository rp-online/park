(() => {
  let snackbarStack = [];

  window.park = Object.assign({}, window.park, {
    snackbarManager: {
      register: (snackbarElem, snackbarCloseFn) => {
        snackbarStack.push({
          elem: snackbarElem,
          closeFn: snackbarCloseFn,
        });
      },
      unregister: (snackbarElem) => {
        snackbarStack = snackbarStack.filter(snackbar => snackbar.elem !== snackbarElem);
      },
      close: (id) => {
        const snackbarElem = document.getElementById(`park-snackbar-${id}`);
        const toggleElems = window.park.$(`[aria-controls="park-snackbar-${id}"]`);

        if (!snackbarElem) {
          return false;
        }

        snackbarElem.classList.add('park-snackbar--is-closing');
        window.setTimeout(() => {
          snackbarElem.setAttribute('aria-hidden', 'true');
          toggleElems.forEach((elem) => {
            elem.setAttribute('aria-expanded', 'false');
          });
          if (snackbarElem.close) {
            snackbarElem.close();
          }
          window.park.snackbarManager.unregister(snackbarElem);

          window.park.eventHub.trigger(document, 'park.snackbar:close', {
            elem: snackbarElem,
          });
        });

        return true;
      },
      open: (id) => {
        const snackbarElem = document.getElementById(`park-snackbar-${id}`);
        const toggleElems = window.park.$(`[aria-controls="park-snackbar-${id}"]`);

        if (!snackbarElem) {
          return false;
        }

        const closeFn = () => {
          window.park.snackbarManager.close(id);
        };

        snackbarElem.classList.remove('park-snackbar--is-closing');
        snackbarElem.removeAttribute('aria-hidden');
        toggleElems.forEach((elem) => {
          elem.setAttribute('aria-expanded', 'true');
        });

        window.park.snackbarManager.register(snackbarElem, closeFn);

        window.park.eventHub.trigger(document, 'park.snackbar:open', {
          elem: snackbarElem,
        });

        return closeFn;
      },
    },
  });
})();
