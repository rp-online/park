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

function build() {
  const componentsGlobals = Object.assign({}, globals);

  componentsGlobals.keys = {};
  componentsGlobals.disabledTrackers = true;
  componentsGlobals.disabledAds = true;

  const inventoryFile = `${path.resolve(process.cwd(), 'dist/inventory.html')}`;

  return new Promise((onSuccess, onError) => {
    globby(`${path.resolve(process.cwd(), 'src/components/**/*.twig')}`).then((result) => {
      const promises = result
        .filter(templateFile => !/[/\\](header|footer)[/\\]template/.test(templateFile))
        .map((templateFile) => {
          const dirName = path.dirname(templateFile);
          const componentName = dirName.split('/').pop();
          const componentParts = [];

          componentParts.push(new Promise((resolve) => {
            globby(`${dirName}/data/*.json`).then((result) => {
              const promises = result.map((dataFile) => {
                const variant = path.basename(dataFile).replace('.json', '');

                return new Promise((resolve) => {
                  fs.readFile(dataFile, 'utf8', (err, data) => {
                    if (err) {
                      throw err;
                    }

                    const obj = JSON.parse(data);

                    obj.config = componentsGlobals;
                    obj.settings = {
                      views: `${path.resolve(process.cwd(), 'src').replace(/\\/g, '/')}`,
                    };

                    Twig.renderFile(templateFile, obj, (err, result) => {
                      if (err) {
                        throw err;
                      }

                      resolve({
                        variant,
                        result,
                      });
                    });
                  });
                });
              });

              Promise.all(promises).then((result) => {
                resolve(result);
              });
            });
          }));

          return new Promise((resolve) => {
            Promise.all(componentParts).then(([variants]) => {
              let inventoryHtml = '';

              if (variants.length > 1) {
                const firstVariant = variants.filter(result => result.variant === 'default');
                const remainingVariants = variants.filter(result => result.variant !== 'default');

                variants = [].concat(firstVariant, remainingVariants);
              }

              const promises = variants.map(result => new Promise((resolve) => {
                resolve([
                  `<h2 id="${componentName}-${result.variant}" class="park-inventory__component-headline">
                    <a href="./components/${componentName}${(result.variant !== 'default' ? `-${result.variant}` : '')}.html" target="_blank">${componentName}${(result.variant !== 'default' ? ` (${result.variant})` : '')}</a>
                    </h2>`,
                  result.result,
                ].join('\n'));
              }));

              Promise.all(promises)
                .then((result) => {
                  inventoryHtml += result.join('\n');

                  resolve(inventoryHtml);
                });
            }).catch(err => onError(err));
          });
        });

      Promise.all(promises).then((results) => {
        fs.readFile(`${process.cwd()}/src/components/header/data/default.json`, 'utf8', (err, data) => {
          if (err) {
            throw err;
          }

          const header = JSON.parse(data);

          header.config = componentsGlobals;

          fs.readFile(`${process.cwd()}/src/components/footer/data/default.json`, 'utf8', (err, data) => {
            if (err) {
              throw err;
            }

            const footer = JSON.parse(data);

            footer.config = componentsGlobals;

            const templateFile = `${path.resolve(process.cwd(), 'src/twig/inventory.twig')}`;

            Twig.renderFile(templateFile, {
              globals,
              header,
              main: results.join('\n'),
              footer,
              settings: {
                views: `${path.resolve(process.cwd(), 'src').replace(/\\/g, '/')}`,
              },
            }, (err, html) => {
              fs.writeFile(inventoryFile, html, (err) => {
                if (err) {
                  onError(err);
                }
                onSuccess();
              });
            });
          });
        });
      });
    });
  });
}

module.exports = build;
