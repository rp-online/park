(() => {
  const methodsAndColors = {
    log: 'black',
    info: 'blue',
    warn: 'orange',
    error: 'red',
  };

  window.park = Object.assign({}, window.park, {
    console: (() => {
      const newMethods = {};

      Object.keys(methodsAndColors).forEach((method) => {
        const styles = [
          `color: ${methodsAndColors[method]}`,
          'font-size: 1rem',
        ].join(';');

        newMethods[method] = (...args) => {
          [].slice.call(args).forEach((argument) => {
            if (window.location.href.indexOf('?browserConsole=true') < 0) {
              return;
            }
            switch (typeof argument) {
              default:
                console[method](argument);
                break;

              case 'string':
                console[method](`%c ${argument}`, styles);
                break;
            }
          });
        };
      });

      return newMethods;
    })(),
  });
})();
