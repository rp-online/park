(() => {
  const create = (options) => {
    if (!options.type) {
      window.park.console.error('A widget was programmatically initialized without setting the type property');
    }

    const widget = document.createElement('span');

    widget.classList.add('park-widget');
    widget.classList.add(`park-widget--${options.type}`);
    widget.setAttribute('data-type', options.type);

    if (options.initialState) {
      widget.setAttribute('data-initial-state', JSON.stringify(options.initialState));
    }

    return widget;
  };

  const prepend = (options, target) => {
    const widget = create(options);
    const targetParent = target.parentNode;

    if (widget && target && targetParent) {
      targetParent.insertBefore(widget, target);
    }

    return widget;
  };

  const replace = (options, target) => {
    const widget = create(options);
    const targetParent = target.parentNode;

    if (widget && target && targetParent) {
      targetParent.replaceChild(widget, target);
    }

    return widget;
  };

  window.park = Object.assign({}, window.park, {
    widgets: {
      create,
      prepend,
      replace,
    },
  });
})();
