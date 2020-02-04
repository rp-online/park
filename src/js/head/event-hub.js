(() => {
  function trigger(elem, eventType, data) {
    if (!elem) {
      return;
    }

    const event = new CustomEvent(eventType, {
      bubbles: true,
      cancelable: false,
      detail: data,
    });

    elem.dispatchEvent(event);
  }

  window.park = Object.assign({}, window.park, {
    eventHub: {
      trigger,
    },
  });
})();
