const globby = require('globby');
const pwaManifest = require('pwa-manifest');
const path = require('path');
const fs = require('fs');

module.exports = () => new Promise((onSuccess, onError) => {
  globby(`${path.resolve(process.cwd(), 'src/skins/*/manifest.json')}`)
    .then((files) => {
      files.forEach((file) => {
        const client = path.dirname(file).split('/').pop();
        let data = fs.readFileSync(file, 'utf8');

        data = JSON.parse(data);

        pwaManifest(data).catch((err) => {
          onError(err);
        }).then((manifest) => {
          pwaManifest.write(`${path.resolve(process.cwd(), `dist/assets/skins/${client}/`)}`, manifest);
          onSuccess();
        });
      });
    });
});
