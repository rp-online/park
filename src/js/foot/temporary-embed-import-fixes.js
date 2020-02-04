(() => {
  function replace(oldElem, newElem) {
    if (oldElem.closest('[class^="park-embed"]')) {
      oldElem.parentNode.replaceChild(newElem, oldElem);
    } else {
      const embedHTMLElem = document.createElement('div');

      embedHTMLElem.className = 'park-embed-html';
      embedHTMLElem.appendChild(newElem);
      oldElem.parentNode.replaceChild(embedHTMLElem, oldElem);
    }
  }

  function createPlayBuzzEmbed(elem, id) {
    const playbuzzElem = document.createElement('div');

    playbuzzElem.className = 'playbuzz';
    playbuzzElem.setAttribute('data-id', id);
    playbuzzElem.setAttribute('data-comments', 'false');
    playbuzzElem.setAttribute('data-show-share', 'false');

    replace(elem, playbuzzElem);

    if (window.Playbuzz) {
      window.Playbuzz.render(playbuzzElem);
    } else {
      window.park.resourceLoader.script('https://cdn.playbuzz.com/widget/feed.js');
    }
  }

  // Fix for broken Youtube Embed
  window.park.observer.initialize('iframe[src*="www.youtube.com/watch?v="]', (elem) => {
    const src = elem.getAttribute('src');
    const videoId = src.replace(/^.*watch\?v=([^&]*).*?$/, '$1');
    const videoElem = document.createElement('div');

    videoElem.className = 'park-video park-video--do-not-track';
    videoElem.setAttribute('data-video-id', videoId);
    videoElem.style.backgroundImage = `url('https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg')`;

    replace(elem, videoElem);
  }, false);

  // Fix for broken Facebook Embeds
  window.park.observer.initialize('iframe[src*="www.facebook.com"]:not([src*="/plugins/"])', (elem) => {
    const src = elem.getAttribute('src');
    const url = src.replace(/^(.*\/[0-9]+).*?$/, '$1');
    const facebookElem = document.createElement('span');

    facebookElem.className = 'park-embed-facebook-post fb-post';
    facebookElem.setAttribute('data-href', url);

    replace(elem, facebookElem);
  }, false);

  // Fix for broken Playbuzz Embeds with ID
  window.park.observer.initialize('div[data-game*="www.playbuzz.com"][data-game*="/item/"]:not([data-id])', (elem) => {
    const gameUrl = elem.getAttribute('data-game');
    const id = gameUrl.replace(/^.*\/item\/([^/]+).*$/, '$1');

    createPlayBuzzEmbed(elem, id);
  }, false);

  // Fix for broken Playbuzz Embeds without ID
  window.park.observer.initialize('div[data-game*="www.playbuzz.com"]:not([data-game*="/item/"]):not([data-id])', (elem) => {
    const gameUrl = elem.getAttribute('data-game');

    window
      .park
      .ajax(`https://oembed.playbuzz.com/item?url=${gameUrl}&show-info=false&show-share=false&omit-script=false`)
      .then(result => result.json())
      .then((result) => {
        const url = result.url;
        const id = url.replace(/^.*\/item\/([^/]+).*$/, '$1');

        createPlayBuzzEmbed(elem, id);
      });
  }, false);

  // Fix for broken Google Map Traffic Embeds
  window.park.observer.initialize('.gmap-traffic-init', (elem) => {
    const mapElem = document.createElement('aside');
    const mapElemMap = document.createElement('div');

    mapElem.appendChild(mapElemMap);

    mapElem.className = 'park-embed-map';
    mapElemMap.className = 'park-embed-map__map';
    mapElem.setAttribute('data-lat', elem.getAttribute('data-lat'));
    mapElem.setAttribute('data-lng', elem.getAttribute('data-lng'));
    mapElem.setAttribute('data-zoom', elem.getAttribute('data-zoom'));
    mapElem.setAttribute('data-traffic', '');

    replace(elem, mapElem);
  }, false);
})();
