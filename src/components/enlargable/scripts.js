(() => {
  const selector = 'a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"], a[href$=".svg"], a[href$=".webp"], a[href$=".JPG"], a[href$=".JPEG"], a[href$=".PNG"], a[href$=".GIF"], a[href$=".SVG"], a[href$=".WEBP"]';
  let enlargableExists = false;

  function createEnlargableWidget(data) {
    const initialState = {
      type: 'enlargable-overlay',
      initialState: data,
    };

    if (enlargableExists) {
      window.park.eventHub.trigger(document, 'park.enlargable:change', data);
    } else {
      enlargableExists = true;

      const widget = window.park.widgets.create(initialState);
      document.querySelector('body').appendChild(widget);
    }

    if (window.park.eventHub) {
      window.park.eventHub.trigger(document, 'park.enlargable:enlarged', {
        elem: document.querySelector('#park-overlay-enlargable'),
      });
    }
  }

  function createEnlargable(largeImageURL, captionHTML) {
    (new Image()).src = largeImageURL;

    createEnlargableWidget({
      id: 'enlargable',
      children: [
        {
          component: 'html',
          data: {
            html: `<figure>
                <img src="${largeImageURL}" 
                  alt="Vergrößerte Ansicht des angeklickten Bildes" 
                  class="park-enlargable__image">
                <figcaption class="park-enlargable__caption">${captionHTML}</figcaption>
              </figure>`,
          },
        },
      ],
      startOpened: true,
    });
  }

  window.park.eventHub.register('mouseenter', selector, (e) => {
    const elem = e.target.closest('a[href]');

    (new Image()).src = elem.href;
  });

  window.park.eventHub.register('click', selector, (e) => {
    const elem = e.target.closest('a[href]');
    const largeImageURL = elem.href;
    const captionElemId = elem.getAttribute('aria-describedby');
    const captionElem = document.getElementById(captionElemId);
    const photoCreditElem = captionElem ? captionElem.querySelector('[class$="source"]') : null;
    const captionHTML = photoCreditElem ? photoCreditElem.innerHTML.trim() : '';

    createEnlargable(largeImageURL, captionHTML);

    e.preventDefault();
  });
})();
