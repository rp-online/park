(() => {
  const $ = window.park.$;

  function initializeTabContainer() {
    window.park.observer.initialize('[role="tablist"]', (tabList) => {
      const tabs = $('a[aria-controls]', tabList);
      const firstTab = tabs[0];

      if (firstTab) {
        firstTab.setAttribute('aria-selected', 'true');
      }
    }, false);

    window.park.observer.initialize('[role="tabpanel"]', (panel) => {
      const panelId = panel.getAttribute('id');
      const tab = document.querySelector(`a[aria-controls="${panelId}"]`);

      if (!tab) {
        return;
      }

      const isSelected = tab.getAttribute('aria-selected') === 'true';

      if (isSelected) {
        panel.removeAttribute('aria-hidden');
      } else {
        panel.setAttribute('aria-hidden', 'true');
      }
    }, false);

    window.park.observer.initialize('div[role="tabpanel"]', (panel) => {
      window.park.lazyLoad(panel);
    });
  }

  initializeTabContainer();

  window.park = Object.assign({}, window.park, { initializeTabContainer });
})();
