(() => {
  function $(selector, elem) {
    elem = elem || document;
    return [].slice.call(elem.querySelectorAll(selector));
  }

  window.park.eventHub.register('click', '[role="tablist"] a[aria-controls]', (e) => {
    const tab = e.target.closest('a[aria-controls]');
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    const tabList = tab.closest('[role="tablist"]');
    const tabs = $('a[aria-controls]', tabList);
    const panels = $('[role="tabpanel"]', panel.parentElement);

    tabs.forEach((tab) => {
      tab.removeAttribute('aria-selected');
    });
    tab.setAttribute('aria-selected', 'true');

    panels.forEach((panel) => {
      panel.setAttribute('aria-hidden', 'true');
    });
    panel.removeAttribute('aria-hidden');

    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.tab-container:toggled', {
        elem: tabList,
      });
    }

    e.preventDefault();
    e.stopImmediatePropagation();
  });
})();
