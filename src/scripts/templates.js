const globby = require('globby');
const path = require('path');
const fs = require('fs');

module.exports = () => new Promise((onSuccess, onError) => {
  const templates = {};

  globby(`${path.resolve(process.cwd(), 'src/components/**/*.twig')}`)
    .then((files) => {
      files.forEach((file) => {
        const key = `${path.dirname(file).split('/').pop()}.twig`;
        let data = fs.readFileSync(file, 'utf8');

        data = data.replace(/include '.+?(['\s~]*[\.a-z\-]+['\s~]*\.svg)'/g, 'include \'./$1\'');
        data = data.replace(/include 'components\/(.+?['\s~]*[\.a-z\-]+['\s~]*)\/template\.twig'/g, 'include \'./$1.twig\'');

        templates[key] = data;
      });

      return globby(`${path.resolve(process.cwd(), 'src/svg/*.svg')}`);
    })
    .then((files) => {
      files.forEach((file) => {
        templates[path.basename(file)] = fs.readFileSync(file, 'utf8');
      });

      const json = JSON.stringify(templates);

      fs.writeFile(`${path.resolve(process.cwd(), 'dist/assets/widgets/templates.json')}`, json, (err) => {
        if (err) {
          onError(err);
        }
        onSuccess();
      });
    });
});
