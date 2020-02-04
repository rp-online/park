(() => {
  function init() {
    const $ = window.park.$;
    const articles = $('.park-article');
    const articleContentElems = $('.park-article-content');

    if (!articles.length) {
      return;
    }

    if (!articleContentElems.length) {
      return;
    }

    const article = articles[0];
    const textContent = articleContentElems.reduce((acc, curr) => `${acc} ${curr.textContent}`, '');
    const words = textContent.trim().replace(/[\s\t\n\r]+/g, ' ').split(' ');
    const readtimeMinutes = Math.max(1, Math.round(words.length / 200));
    const readtimeMeta = $('.park-article__readtime')[0];

    switch (readtimeMinutes) {
      default:
        readtimeMeta.textContent = `${readtimeMinutes} Minuten`;
        break;

      case 1:
        readtimeMeta.textContent = 'Eine Minute';
        break;
    }

    const scrollIndicator = article.querySelector('.park-article__scroll-indicator');
    const buttons = article.querySelector('.park-article__buttons');

    if (!scrollIndicator || !buttons) {
      return;
    }
    window.park.intersections.observe(scrollIndicator, null, (visibility) => {
      if (visibility) {
        buttons.setAttribute('aria-hidden', 'true');
      } else {
        buttons.removeAttribute('aria-hidden');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  if (document.readyState !== 'loading') {
    init();
  }
})();
