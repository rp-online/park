const globby = require('globby');
const path = require('path');
const fs = require('fs');
const svg2png = require('svg2png');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

module.exports = (glob, dest, size) => {
  let destStats = {
    mtime: new Date(0),
  };

  if (fs.existsSync(dest)) {
    destStats = fs.statSync(dest);
    console.log(`${dest}'s last modification date: ${destStats.mtime}`);
  } else {
    console.log(`${dest} does not exist yet.`);
  }

  return globby(`${path.resolve(process.cwd(), glob)}`).then((files) => {
    for (const file of files) {
      const fileStats = fs.statSync(file);

      if (fileStats.mtime > destStats.mtime) {
        console.log(`${dest} needs to be created/updated... please be patient ...`);
        return new Promise((onSuccess, onError) => {
          globby(`${path.resolve(process.cwd(), glob)}`).then((result) => {
            const promises = result
              .map(svg => new Promise((resolve, reject) => {
                fs.readFile(svg, (err, buffer) => {
                  svg2png(buffer, {
                    width: size,
                    height: size,
                  })
                    .then((buffer) => {
                      return imagemin.buffer(buffer, {
                        plugins: [
                          imageminPngquant({
                            nofs: true,
                            quality: '50-65',
                          }),
                        ],
                      });
                    })
                    .then((buffer) => {
                      resolve({
                        id: path.basename(svg, '.svg'),
                        data: buffer.toString('base64'),
                      });
                    })
                    .catch((e) => {
                      console.error(e);
                      reject();
                    });
                });
              }));

            Promise.all(promises).then((results) => {
              let sprite = `<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <style>:root>svg{display:none}:root>svg:target{display:block}</style>`;

              sprite += results.map(result => `<svg id="${result.id}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
<image xlink:href="data:image/png;base64,${result.data}" x="0" y="0" height="${size}px" width="${size}px"/>
</svg>`).join('');

              sprite += '</svg>';

              fs.writeFile(dest, sprite, (err) => {
                if (err) {
                  onError(err);
                }
                onSuccess();
              });
            }, (err) => {
              onError(err);
            });
          });
        });
      }
    }

    console.log(`${dest} is up to date!`);
    return new Promise((onSuccess) => {
      onSuccess();
    });
  });
};

