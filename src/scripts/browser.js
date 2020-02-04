const globby = require('globby');
const fs = require('fs');
const path = require('path');
const Twig = require('twig');
const twigMarkdown = require('twig-markdown');
const twigFlush = require('./../libs/twig-flush');

Twig.extend(twigMarkdown);
Twig.extend(twigFlush);
Twig.cache(false);

const globals = require('./globals.json');
const localFile = `${path.resolve(process.cwd(), 'src/scripts/local.json')}`;

if (fs.existsSync(localFile)) {
  const local = JSON.parse(fs.readFileSync(localFile, 'utf8'));

  Object.assign(globals, local);
}

function readFile(file) {
  return new Promise((resolve) => {
    fs.readFile(file, 'utf8', (err, data) => {
      resolve(data);
    });
  });
}

function getVariants(componentName, variantFiles) {
  const result = variantFiles.map(async (variantFile) => {
    const variantName = path.basename(variantFile).replace('.json', '');

    return {
      name: variantName,
      preview: `./components/${componentName}${variantName !== 'default' ? `-${variantName}` : ''}.html`,
      data: await readFile(variantFile),
    };
  });

  return Promise.all(result);
}


function twigRender(data) {
  const templateFile = `${path.resolve(process.cwd(), 'src/twig/browser.twig')}`;
  const destinationFile = `${path.resolve(process.cwd(), 'dist/browser.html')}`;
  const componentsGlobals = Object.assign({}, globals);

  componentsGlobals.version = (new Date()).getTime();
  componentsGlobals.keys = {};
  componentsGlobals.disableTrackers = true;
  componentsGlobals.disableAds = false;
  componentsGlobals.development = false;

  return new Promise((resolve) => {
    Twig.renderFile(templateFile, {
      config: componentsGlobals,
      title: 'Component Browser',
      data,
      settings: {
        views: `${path.resolve(process.cwd(), 'src').replace(/\\/g, '/')}`,
      },
    }, (err, html) => {
      fs.writeFile(destinationFile, html, () => {
        resolve();
      });
    });
  });
}

async function asyncBuild() {
  const data = {
    readme: '',
    navigation: {
      header: [
        {
          headline: {
            tag: 'strong',
            text: 'Seiten',
          },
          items: [
            {
              text: 'Startseite',
              href: '#void',
            },
            {
              text: 'Artikelseite',
              href: '#void',
            },
            {
              text: 'Bilderstrecke',
              href: '#void',
            },
            {
              text: 'Infostrecke',
              href: '#void',
            },
          ],
        },
      ],
      main: [],
      footer: [
        {
          headline: {
            tag: 'strong',
            text: 'Autoren',
          },
          items: [
            {
              text: 'Christian "Schepp" Schaefer',
              href: '#void',
            },
            {
              text: 'Pascal Weiland',
              href: '#void',
            },
            {
              text: 'Tobias Block',
              href: '#void',
            },
          ],
        },
      ],
    },
    components: [],
  };
  const generalMarkdownFiles = await globby([
    `${path.resolve(process.cwd(), 'ueberblick.md')}`,
    `${path.resolve(process.cwd(), 'src/**/liesmich.md')}`,
  ]);
  const componentFolders = await globby(`${path.resolve(process.cwd(), 'src/components/*/')}`);
  const componentTemplateFiles = await globby(`${path.resolve(process.cwd(), 'src/components/**/template.twig')}`);
  const componentTemplateContents = {};

  componentTemplateFiles.forEach(async (templateFile) => {
    const dirName = path.dirname(templateFile);
    const componentName = dirName.split('/').pop();

    componentTemplateContents[componentName] = await readFile(templateFile);
  });

  const componentDataFiles = await globby(`${path.resolve(process.cwd(), 'src/components/**/data/*.json')}`);
  const componentDataContents = {};

  componentDataFiles.forEach(async (dataFile) => {
    const dirName = path.dirname(dataFile);
    const dirNameParts = dirName.split('/');

    dirNameParts.pop();

    const componentName = dirNameParts.pop();

    if (componentDataContents[componentName]) {
      componentDataContents[componentName] += await readFile(dataFile);
    } else {
      componentDataContents[componentName] = await readFile(dataFile);
    }
  });

  const pageDataFiles = await globby(`${path.resolve(process.cwd(), 'src/pages/**/data.json')}`);
  const pageDataContents = {};
  const promisesGeneralMarkdownContents = generalMarkdownFiles.map(mdFile => readFile(mdFile));
  const resultPageDataContents = pageDataFiles.map(async (dataFile) => {
    const dirName = path.dirname(dataFile);
    const dirNameParts = dirName.split('/');
    const pageName = dirNameParts.pop();

    pageDataContents[pageName] = await readFile(dataFile);

    return true;
  });

  Promise.all(promisesGeneralMarkdownContents).then(async (result) => {
    data.readme = result.join('\n\n<hr>\n\n');

    Promise.all(resultPageDataContents).then(async () => {
      const componentsResult = componentFolders.map(async (componentFolder) => {
        const componentName = componentFolder.split('/').pop();
        const readmeFile = `${componentFolder}/liesmich.md`;
        const templateFile = `${componentFolder}/template.twig`;
        const stylesFile = `${componentFolder}/styles.scss`;
        const headFile = `${componentFolder}/head.js`;
        const scriptsFile = `${componentFolder}/scripts.js`;
        const variantFiles = await globby(`${componentFolder}/data/*.json`);
        const componentData = {
          name: componentName,
          components: (() => {
            const result = [];

            Object.keys(componentTemplateContents).forEach((name) => {
              if (
                result.indexOf(name) === -1 &&
                (
                  componentTemplateContents[name].indexOf(`'components/${componentName}/template.twig'`) > -1 ||
                  (componentName.startsWith('card-') && componentTemplateContents[name].indexOf('\'components/card-') > -1)
                )
              ) {
                result.push(name);
              }
            });

            Object.keys(componentDataFiles).forEach((name) => {
              if (result.indexOf(name) === -1 && componentDataFiles[name].indexOf(`"${componentName}"`) > -1) {
                result.push(name);
              }
            });

            result.sort();

            return result.map(entry => ({
              href: `#${entry}`,
              text: entry,
            }));
          })(),
        };

        componentData.pages = (() => {
          const result = [];

          Object.keys(pageDataContents).forEach((pageName) => {
            componentData.components.forEach((component) => {
              if (result.indexOf(pageName) === -1 && pageDataContents[pageName].indexOf(`"${component.text}"`) > -1) {
                result.push(pageName);
              }
            });

            if (result.indexOf(pageName) === -1 && pageDataContents[pageName].indexOf(`"${componentName}"`) > -1) {
              result.push(pageName);
            }
          });

          result.sort();

          return result.map(entry => ({
            href: `./${entry}.html`,
            text: entry,
            target: '_blank',
          }));
        })();

        data.navigation.main.push({
          text: componentName,
          href: `#${componentName}`,
        });

        if (fs.existsSync(readmeFile)) {
          componentData.readme = await readFile(readmeFile);
        }

        componentData.sourcecodes = {};

        if (fs.existsSync(templateFile)) {
          componentData.sourcecodes.template = await readFile(templateFile);
        }

        if (fs.existsSync(stylesFile)) {
          componentData.sourcecodes.styles = await readFile(stylesFile);
        }

        if (fs.existsSync(headFile)) {
          componentData.sourcecodes.head = await readFile(headFile);
        }

        if (fs.existsSync(scriptsFile)) {
          componentData.sourcecodes.scripts = await readFile(scriptsFile);
        }

        if (variantFiles.forEach && variantFiles.length) {
          componentData.variants = await getVariants(componentName, variantFiles);
        }

        return componentData;
      });

      Promise.all(componentsResult).then(async (result) => {
        data.components = result;

        await twigRender(data);
      });
    });
  });
}

function build() {
  return new Promise((onSuccess) => {
    asyncBuild();
    onSuccess();
  });
}

module.exports = build;
