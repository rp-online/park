import Twig from 'twig';
import twigMarkdown from './../libs/patched-twig-markdown';

let templates;
let lastPostMessageTimestamp = (new Date()).getTime();

Twig.extend(twigMarkdown);

Twig.extend((Twig) => {
  Twig.Templates.registerLoader('ajax', function parkLoader(location, params, successCallback) {
    const parser = this.parsers[params.parser] || this.parser.twig;

    params.url = location;
    params.data = templates[location];

    const template = parser.call(this, params);

    if (typeof successCallback === 'function') {
      successCallback(template);
    }

    return template;
  });
});

function deleyedPostMessage(data) {
  const timestamp = (new Date()).getTime();

  if (lastPostMessageTimestamp < (timestamp - 100)) {
    postMessage(data);

    lastPostMessageTimestamp = timestamp;

    return;
  }

  setTimeout(() => {
    deleyedPostMessage(data);
  }, 100);
}

function config(e) {
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState !== 4) {
      return;
    }

    if (xmlhttp.status !== 200) {
      console.error('Twig Worker: Failed to fetch templates.json');
      return;
    }

    templates = JSON.parse(xmlhttp.responseText);
  };
  xmlhttp.open('GET', `./templates.json?v=${e.data.version}`);
  xmlhttp.send();
}

function process(e) {
  if (!templates) {
    setTimeout(() => {
      process(e);
    }, 100);
    return;
  }

  Twig.twig({
    href: `${e.data.component}.twig`,
    method: 'ajax',
    allowInlineIncludes: true,
    autoescape: 'html',
    load: (template) => {
      const html = template
        .render(e.data.data)
        .trim()
        .replace(/<!--\[IF !IE]> -->/g, '')
        .replace(/<!-- <!\[ENDIF]-->/g, '');

      console.info(`Twig Worker: Successfully rendered the template for the ${e.data.container} widget`);

      deleyedPostMessage({
        container: e.data.container,
        html,
      });
    },
  });
}

self.onmessage = (e) => {
  switch (e.data.action) {
    default:
      break;

    case 'config':
      config(e);
      break;

    case 'render':
      process(e);
      break;
  }
};
