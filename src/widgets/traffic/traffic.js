(() => {
  function reducer(state, action) {
    switch (action.type) {
      case 'UPDATEBLOCKS':
        state.blocks = action.value;
        break;

      case 'UPDATE':
        state = action.value;
        break;

      default:
        break;
    }
    return state;
  }

  window.park.app({
    container: 'traffic',
    component: 'tab-container',
    reducer,
  }).then((app) => {
    const state = app.store.getState();
    const initialState = JSON.parse(JSON.stringify(state));
    const url = state.ajax && state.ajax.url ? state.ajax.url : undefined;
    const fetch = () => (url ? window.park.ajax(`${window.park.exports.config.rootBase}${url}`)
      .then(result => result.json()) : new Promise(resolve => resolve([])));
    const updateBlocks = (items) => {
      const blockMap = {};
      let blocks = [];

      if (items.length < 6) {
        blocks = [{
          title: 'Alle',
          items,
        }];
      } else {
        items.forEach((item) => {
          const key = item.headline.badge;

          if (!blockMap[key]) {
            blockMap[key] = {
              title: key,
              items: [],
            };
          }

          blockMap[key].items.push(item);
        });

        Object.keys(blockMap).forEach((key) => {
          blocks.push(blockMap[key]);
        });
      }

      app.store.dispatch({
        type: 'UPDATEBLOCKS',
        value: blocks,
      });

      setTimeout(window.park.initializeTabContainer, 0);
    };
    const update = () => {
      if (window.park.user.isLoggedIn()) {
        const promises = [
          window.park.user.getTrafficRoads(),
          fetch(),
        ];

        Promise.all(promises)
          .then((results) => {
            const trafficRoads = results[0];
            let items = results[1];

            if (!items.length) {
              return;
            }

            if (trafficRoads && trafficRoads.forEach) {
              items = items.filter((item) => {
                const key = item.headline.badge;

                return trafficRoads.indexOf(key) > -1;
              });
            }

            updateBlocks(items);
          })
          .catch(() => {
            window.park.console.info('Traffic widget is unable to either get the user\'s preferences or to fetch the traffic data');
          });
        return;
      }

      if (!initialState.blocks && url) {
        fetch()
          .then((items) => {
            updateBlocks(items);
          })
          .catch(() => {
            window.park.console.info('Traffic widget is unable to fetch the traffic data');
          });
        return;
      }

      app.store.dispatch({
        type: 'UPDATE',
        value: initialState,
      });
    };

    app.bindEvent('park.widget:rendered', () => {
      window.park.initializeTabContainer();
    });

    document.addEventListener('park.user:authchange', () => {
      window.setTimeout(update);
    });

    if (window.park.user.isLoggedIn() || !initialState.blocks) {
      update();
    }
  });
})();
