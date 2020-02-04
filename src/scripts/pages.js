const globby = require('globby');
const fs = require('fs');
const path = require('path');
const Twig = require('twig');
const twigMarkdown = require('twig-markdown');
const twigFlush = require('./../libs/twig-flush');
const commandExists = require('command-exists');
const { exec } = require('child_process');

Twig.extend(twigMarkdown);
Twig.extend(twigFlush);
Twig.cache(false);

const globals = require('./globals.json');

globals.version = (new Date()).getTime();

const localFile = `${path.resolve(process.cwd(), 'src/scripts/local.json')}`;
const composerVendorAutoload = `${path.resolve(process.cwd(), '../vendor/autoload.php')}`;

if (fs.existsSync(localFile)) {
  const local = JSON.parse(fs.readFileSync(localFile, 'utf8'));

  Object.assign(globals, local);
}

function build() {
  const starttime = (() => {
    const hrTime = process.hrtime();
    return ((hrTime[0] * 1000000) + (hrTime[1] / 1000));
  })();

  return new Promise((onSuccess, onError) => {
    fs.readFile(`${process.cwd()}/src/components/header/data/default.json`, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      const header = JSON.parse(data);

      header.globals = globals;

      fs.readFile(`${process.cwd()}/src/components/footer/data/default.json`, 'utf8', (err, data) => {
        if (err) {
          throw err;
        }

        const footer = JSON.parse(data);

        footer.globals = globals;

        globby(`${path.resolve(process.cwd(), 'src/pages/**/*.twig')}`).then((result) => {
          const promises = result
            .map((templateFile) => {
              const dirName = path.dirname(templateFile);
              const pageName = dirName.split(/[/\\]/).pop();
              const dataFile = `${dirName}/data.json`;
              const distFile = `${path.resolve(process.cwd(), `dist/${pageName}.html`)}`;

              return new Promise((resolve, reject) => {
                fs.readFile(dataFile, 'utf8', (err, data) => {
                  if (err) {
                    throw err;
                  }

                  const obj = JSON.parse(data);

                  obj.globals = globals;

                  if (obj.config) {
                    obj.config.version = (new Date()).getTime();
                  }

                  obj.header = header;
                  obj.footer = footer;
                  obj.settings = {
                    views: `${path.resolve(process.cwd(), 'src').replace(/\\/g, '/')}`,
                  };

                  Twig.renderFile(templateFile, obj, (err, result) => {
                    if (err) {
                      throw err;
                    }

                    fs.writeFile(distFile, result, (err) => {
                      if (err) {
                        reject(err);
                      }
                      resolve();
                    });
                  });
                });
              });
            });

          return Promise.all(promises).then(() => {
            onSuccess();

            const endtime = (() => {
              const hrTime = process.hrtime();
              return ((hrTime[0] * 1000000) + (hrTime[1] / 1000));
            })();

            console.log('---');
            console.log(`Time taken: ${Math.round(endtime - starttime) / 1000000} secs.`);
          }, (err) => {
            onError(err);
          });
        });
      });
    });
  });
}


function switcher() {
  return new Promise((onSuccess, onError) => {
    const revertToNode = () => {
      console.log('Using Node to compile the dummy pages');
      build()
        .then(() => {
          onSuccess();
        })
        .catch((err) => {
          onError(err);
        });
    };

    if (!fs.existsSync(composerVendorAutoload)) {
      revertToNode();
      return;
    }

    commandExists('php')
      .then(() => {
        console.log('Using PHP to compile the dummy pages');
        exec('php -d display_errors=on pages.php', {
          cwd: __dirname,
        },
        (err, stdout, stderr) => {
          if (err) {
            onError(err);
            return;
          }

          // the *entire* stdout and stderr (buffered)
          if (stdout) {
            console.log(stdout);
          }

          if (stderr) {
            console.error(stderr);
          }
          onSuccess();
        });
      }).catch(() => {
        revertToNode();
      });
  });
}

module.exports = switcher;
