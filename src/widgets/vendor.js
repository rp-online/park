import { createStore } from 'redux';
import morphdom from 'morphdom';
import { lory } from 'lory.js';

const twigWorker = new Worker(`${window.park.exports.config.assetsBase}/widgets/twig-worker.js?v=${window.park.exports.config.version}`);

twigWorker.postMessage({
  action: 'config',
  version: window.park.exports.config.version,
});

window.park = Object.assign({}, window.park, {
  app: params => new Promise((resolve) => {
    function insertHTML(html, container) {
      container = container || params.container;

      const elems = window.park.$(`.park-widget[data-type="${container}"]`);

      elems.forEach((elem) => {
        const targetNode = elem.firstElementChild ?
            elem.firstElementChild : elem.appendChild((() => {
              const newNode = document.createElement('div');

              newNode.classList.add('park-node');
              newNode.innerHTML = '<div></div>';

              return newNode;
            })());

        if (elem.childElementCount > 1) {
          window.park.console.error(`The "${params.container}" widget has more than one direct child element! Please ensure that the template used by that widget has a wrapper around all of the elements.`);
          return;
        }

        if (targetNode.innerHTML) {
          morphdom(targetNode, html);
        } else {
          targetNode.innerHTML = html;
        }
        window.park.console.info(`"${container}" widget inserted`);
        window.park.eventHub.trigger(elem, 'park.widget:rendered');
      });
    }

    let timeout;
    let elems = [];
    let store;
    let bindEvent;

    window.park.observer.initialize(`.park-widget[data-type="${params.container}"]`, () => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        elems = window.park.$(`.park-widget[data-type="${params.container}"]`);
        let elemComponent;
        let elemInitialState;

        if (elems.length && elems[0].hasAttribute('data-initial-state')) {
          const elem = elems[0];
          const elemInitialStateJSON = elem.getAttribute('data-initial-state');

          try {
            elemInitialState = JSON.parse(elemInitialStateJSON);
            elemComponent = elem.getAttribute('data-component');
          } catch (e) {
            try {
              const div = document.createElement('div');
              div.innerHTML = elemInitialStateJSON;
              elemInitialState = JSON.parse(div.textContent);
              elemComponent = elem.getAttribute('data-component');
            } catch (e) {
              elemInitialState = {};
            }
          }
        }

        const component = elemComponent || params.component;
        const initialState = Object.assign(
            {},
            { config: window.park.exports.config },
            elemInitialState,
            params.initialState,
          );
        const defaultReducer = state => state;

        bindEvent = (event, selector, handler) => {
          if (!window.park || !window.park.eventHub || !window.park.eventHub.register) {
            window.setTimeout(() => {
              bindEvent(event, selector, handler);
            }, 100);
            return;
          }
          if (typeof selector === 'function') {
            window.park.eventHub.register(event, `.park-widget[data-type="${params.container}"]`, selector);
          } else {
            window.park.eventHub.register(event, `.park-widget[data-type="${params.container}"] ${selector}`, handler);
          }
        };
        store = createStore(params.reducer || defaultReducer, initialState);

          // If there is no component element and no initial element state,
          // the component is not server-rendered.
        const renderTemplate = !elemComponent;

        function render(container, component, data) {
          twigWorker.postMessage({
            action: 'render',
            container,
            component,
            data,
          });
        }

        twigWorker.onmessage = (e) => {
          const container = e.data.container;
          const html = e.data.html.trim();

          insertHTML(html, container);
        };

        store.subscribe(() => {
          render(params.container, component, store.getState());
        });

        if (renderTemplate) {
          render(params.container, component, store.getState());
        }

        window.park.$(`.park-widget[data-type="${params.container}"]`).forEach((elem) => {
          elem.classList.add('park-widget--is-interactive');
          window.park.eventHub.trigger(elem, 'park.widget:initialized');
        });

        resolve({
          store,
          bindEvent,
          elems,
          insertHTML,
        });
      }, 100);
    }, false);
  }),
});

window.lory = lory;
