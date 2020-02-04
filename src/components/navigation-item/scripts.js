(() => {
  let timer;

  function search(input) {
    const searchTerm = (input.parkValue || input.value || '').trim().toLowerCase();
    const menu = input.closest('.park-navigation-item__submenu');
    const resultcount = menu.querySelector('.park-navigation-item__resultcount');
    const itemsList = menu.querySelector('.park-navigation-item__subitems');
    const items = [].slice.call(itemsList.children);
    const filteredItems = items.filter((item) => {
      let result = true;

      if (searchTerm) {
        if (!item.querySelector('a').textContent.trim().toLowerCase().startsWith(searchTerm)) {
          item.style.display = 'none';
          result = false;
        } else {
          item.style.display = 'block';
        }
      } else {
        item.style.display = '';
      }

      return result;
    });
    let resultCountText;

    switch (filteredItems.length) {
      default:
        resultCountText = `${filteredItems.length} Suchergebnisse`;
        break;

      case 0:
        resultCountText = 'Keine Suchergebnisse';
        break;

      case 1:
        resultCountText = '1 Suchergebnis';
        break;
    }

    resultcount.textContent = resultCountText;
  }

  window.park.eventHub.register('submit', '.park-navigation-item .park-searchform', (e) => {
    const input = e.target.querySelector('.park-input__input');

    window.park.eventHub.trigger(input, 'change');

    e.preventDefault();
  });

  window.park.eventHub.register('input change keyup', '.park-navigation-item .park-input__input', (e) => {
    window.clearTimeout(timer);

    timer = window.setTimeout(() => {
      search(e.target);
    }, 300);

    e.preventDefault();
  });
})();
