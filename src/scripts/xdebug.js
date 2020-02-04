const { exec } = require('child_process');

function render() {
  return new Promise((onSuccess, onError) => {
    console.log('Using PHP with XDEBUG to compile the page named "xdebug"');
    exec('php -d xdebug.profiler_enable=on xdebug.php', {
      cwd: __dirname,
    }, (err, stdout, stderr) => {
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
  });
}

module.exports = render;
