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

  componentsGlobals.rootBase = `./../${componentsGlobals.rootBase.replace(/^[./]*/, '')}`;
  componentsGlobals.assetsBase = `./../${componentsGlobals.assetsBase.replace(/^[./]*/, '')}`;
  componentsGlobals.version = (new Date()).getTime();
  componentsGlobals.disableTrackers = false;
  componentsGlobals.disableAds = false;
  componentsGlobals.development = false;

  try {
    fs.mkdirSync(`${path.resolve(process.cwd(), 'dist/components')}`);
  } catch (e) {
    // noop
  }

  return new Promise((onSuccess) => {
    const frameTemplateFile = `${path.resolve(process.cwd(), 'src/twig/components.twig')}`;

    Twig.renderFile(frameTemplateFile, {
      config: componentsGlobals,
      title: '%%title%%',
      main: '%%main%%',
      settings: {
        views: `${path.resolve(process.cwd(), 'src').replace(/\\/g, '/')}`,
      },
    }, (err, frameHtml) => {
      globby(`${path.resolve(process.cwd(), 'src/components/**/*.twig')}`).then((result) => {
        const promises = result
          .map((templateFile) => {
            const dirName = path.dirname(templateFile);
            const componentName = dirName.split('/').pop();

            return new Promise((resolve) => {
              globby(`${dirName}/data/*.json`).then((result) => {
                const promises = result.map((dataFile) => {
                  const variant = path.basename(dataFile).replace('.json', '');

                  return new Promise((resolve) => {
                    fs.readFile(dataFile, 'utf8', (err, data) => {
                      if (err) {
                        throw err;
                      }

                      data = data.replace(/"\.\/assets\//g, '"./../assets/');

                      const obj = JSON.parse(data);

                      obj.config = componentsGlobals;
                      obj.settings = {
                        views: `${path.resolve(process.cwd(), 'src').replace(/\\/g, '/')}`,
                      };

                      const targetFile = `${path.resolve(process.cwd(), `dist/components/${componentName}${(variant !== 'default' ? `-${variant}` : '')}.html`)}`;

                      Twig.renderFile(templateFile, obj, (err, result) => {
                        result = result.replace(/"\.\/assets\//g, '"./../assets/');
                        fs.writeFile(targetFile,
                          frameHtml
                            .replace('%%title%%', `${componentName}${(variant !== 'default' ? ` (${variant})` : '')}`)
                            .replace('%%main%%', result),
                          (err) => {
                            if (err) {
                              console.log(err);
                            }
                            resolve();
                          });
                      });
                    });
                  });
                });

                Promise.all(promises).then(() => {
                  resolve();
                });
              });
            });
          });

        Promise.all(promises).then(() => {
          onSuccess();
        });
      });
    });
  });
}

module.exports = build;
