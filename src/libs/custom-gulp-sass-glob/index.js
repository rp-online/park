const glob = require('glob');
const through = require('through2');

const headFiles = glob.sync('./src/components/**/head.scss').map(file => `@import '../../../${file}';`).join('\n');
const stylesFiles = glob.sync('./src/components/**/styles.scss').map(file => `@import '../../../${file}';`).join('\n');
const printFiles = glob.sync('./src/components/**/print.scss').map(file => `@import '../../../${file}';`).join('\n');

function transform(file, env, callback) {
  let contents = file.contents.toString('utf-8');

  contents = contents.replace('@import \'../../components/**/head.scss\';', headFiles);
  contents = contents.replace('@import \'../../components/**/styles.scss\';', stylesFiles);
  contents = contents.replace('@import \'../../components/**/print.scss\';', printFiles);

  file.contents = new Buffer(contents);

  callback(null, file);
}

module.exports = function gulpSassGlob(options = {}) {
  return through.obj((...args) => {
    transform(...args, options);
  });
};
