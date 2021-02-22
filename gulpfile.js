const gulp = require('gulp');
const gulpMultiProcess = require('gulp-multi-process');
const plugins = require('gulp-load-plugins')({
  DEBUG: false,
  overridePattern: true,
  pattern: [
    /^gulp.*/,
    /^css.*/,
    'autoprefixer',
    'browser-sync',
    'critical',
    'del',
    'merge-stream',
    'run-sequence',
    'webpack',
    'workbox-build',
    'gulp-critical-css',
  ],
  postRequireTransforms: {
    browserSync(browserSync) {
      return browserSync.create();
    },
    critical(critical) {
      return critical.stream;
    },
  },
});

const sassGlob = require('./src/libs/custom-gulp-sass-glob');
const webpackConfig = require('./webpack.config.js');
const browser = require('./src/scripts/browser.js');
const components = require('./src/scripts/components.js');
const inventory = require('./src/scripts/inventory.js');
const pages = require('./src/scripts/pages.js');
const xdebug = require('./src/scripts/xdebug.js');
const profiler = require('./src/scripts/profiler.js');
const sprites = require('./src/scripts/sprites');
const templates = require('./src/scripts/templates');
const manifests = require('./src/scripts/manifests');

const onError = function (error) {
  plugins.notify.onError({
    message: error.message,
  })(error);
  process.exit(-1);
};

const PATHS = {
  data: 'src/components/*/data/*.json',
  scss: {
    exports: {
      src: 'src/skins/*/exports.scss',
      dest: 'src/critical/skins',
      watch: 'src/**/*.scss',
    },
    head: {
      src: 'src/skins/*/head.scss',
      dest: 'dist/assets/skins',
      watch: 'src/**/*.scss',
    },
    main: {
      src: 'src/skins/*/main.scss',
      dest: 'dist/assets/skins',
      watch: 'src/**/*.scss',
    },
    print: {
      src: 'src/skins/*/print.scss',
      dest: 'dist/assets/skins',
      watch: 'src/**/*.scss',
    },
  },
  js: {
    head: {
      src: [
        'src/js/polyfills/*.js',
        'src/js/head/_exports.js',
        'src/js/head/_storage.js',
        'src/js/head/*.js',
        'src/js/head/shared/*.js',
        'src/components/*/head.js',
      ],
      dest: 'head.js',
    },
    main: {
      src: [
        'node_modules/wicg-focus-ring/dist/focus-ring.js',
        'src/js/foot/polyfills/*.js',
        'src/js/foot/_cre-client.js',
        'src/js/iframe-resizer/iframe-resizer.js',
        'src/js/iframe-reloader/iframe-reloader.js',
        'src/js/foot/*.js',
        'src/js/foot/shared/*.js',
        'src/js/*.js',
        'src/components/*/scripts.js',
      ],
      dest: 'main.js',
    },
    personalArea: {
      src: [
        'src/js/personal-area/index.js',
      ],
      dest: 'personal-area.js',
    },
    serviceworker: {
      src: 'src/js/serviceworker/serviceworker.js',
      dest: 'serviceworker.js',
    },
    noopServiceworker: {
      src: 'src/js/serviceworker/noop-serviceworker.js',
      dest: 'noop-serviceworker.js',
    },
    iframeresizer: {
      src: 'src/js/iframe-resizer/iframe-resizer.js',
      dest: 'iframe-resizer.js',
    },
    adblockdetection: {
      src: 'src/js/adblock-detection/adsbygoogle.js',
      dest: 'adsbygoogle.js',
    },
    slots: {
      src: 'src/js/advertisement/*.js',
      dest: 'slots.js',
    },
    marketing: {
      src: 'src/js/marketing/*.js',
      dest: 'marketing.js',
    },
    widgets: {
      src: 'src/widgets/**/*.js',
    },
    cp: {
      src: 'src/skins/*/cp.js',
      dest: 'cp.js',
    },
  },
  json: {
    src: [
      'src/**/*.json',
      'dist/assets/widgets/templates.json',
    ],
  },
  templates: {
    src: 'src/components/*/*.twig',
  },
  html: {
    src: 'src/dist/index.html',
  },
  svg: {
    src: 'src/svg/*.svg',
    dest: 'src/svg/',
  },
  fonts: {
    src: [
      'src/fonts/ttf/Merriweather/Merriweather-Regular.ttf',
      'src/fonts/SourceSansPro/SourceSansPro-Regular.ttf',
      'src/fonts/SourceSansPro/SourceSansPro-Bold.ttf',
      'src/fonts/SourceSerifPro/SourceSerifPro-Regular.ttf',
      'src/fonts/ttf/Open_Sans/OpenSans-Light.ttf',
      'src/fonts/ttf/Open_Sans/OpenSans-Regular.ttf',
      'src/fonts/ttf/Open_Sans/OpenSans-SemiBold.ttf',
      'src/fonts/ttf/Open_Sans/OpenSans-Bold.ttf',
      'src/fonts/ttf/Open_Sans/OpenSans-ExtraBold.ttf',
      'src/fonts/ttf/Raleway/Raleway-Bold.ttf',
      'src/fonts/ttf/Raleway/Raleway-Light.ttf',
      'src/fonts/ttf/Raleway/Raleway-Regular.ttf',
      'src/fonts/ttf/Raleway/Raleway-SemiBold.ttf',
      'src/fonts/ttf/DaxOT-CondMedium/DaxOT-CondMedium.ttf',
      'src/fonts/ttf/MagnaEF-Light/MagnaEF-Light.ttf',
    ],
    dest: 'dist/assets/fonts/',
  },
  server: 'dist/',
};

gulp.task('webpack', (done) => {
  // run webpack
  plugins.webpack(webpackConfig, (e, stats) => {
    if (e) {
      console.error('Error while running Webpack.', e);
      return;
    }

    console.log(stats.toString('minimal'));
    done();
  });
});

gulp.task('browser', ['components'], (done) => {
  browser().catch((e) => {
    console.error('Error while compiling component browser.', e);
  }).then(() => {
    done();
  });
});

gulp.task('components', (done) => {
  components().catch((e) => {
    console.error('Error while compiling components.', e);
    process.exit(-1);
  }).then(() => {
    done();
  });
});

gulp.task('inventory', (done) => {
  inventory().catch((e) => {
    console.error('Error while compiling inventory.', e);
  }).then(() => {
    done();
  });
});

gulp.task('pages', (done) => {
  pages().catch((e) => {
    console.error('Error while compiling pages.', e);
  }).then(() => {
    done();
  });
});

gulp.task('xdebug', (done) => {
  xdebug().catch((e) => {
    console.error('Error while compiling pages.', e);
  }).then(() => {
    done();
  });
});

gulp.task('profiler', (done) => {
  profiler().catch((e) => {
    console.error('Error while compiling pages.', e);
  }).then(() => {
    done();
  });
});

gulp.task('scss:exports', () => gulp.src(PATHS.scss.exports.src)
  .pipe(plugins.sass({ outputStyle: 'compressed' }).on('error', plugins.sass.logError))
  .pipe(gulp.dest(PATHS.scss.exports.dest))
);

gulp.task('scss:critical', () => gulp.src(PATHS.scss.head.src)
  .pipe(sassGlob())
  .pipe(plugins.sass({
    outputStyle: 'compressed',
  }).on('error', plugins.sass.logError))
  .pipe(plugins.criticalCss())
  .pipe(gulp.dest(PATHS.scss.exports.dest))
);

gulp.task('scss:head', () => gulp.src(PATHS.scss.head.src)
  .pipe(sassGlob())
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sass({
    outputStyle: 'compressed',
  }).on('error', plugins.sass.logError))
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest(PATHS.scss.head.dest))
);

gulp.task('scss:main', () => gulp.src(PATHS.scss.main.src)
  .pipe(sassGlob())
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sass({
    outputStyle: 'compressed',
  }).on('error', plugins.sass.logError))
  .pipe(plugins.postcss([
    plugins.autoprefixer(),
    plugins.cssMqpacker(),
  ]))
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest(PATHS.scss.main.dest))
);

gulp.task('scss:print', () => gulp.src(PATHS.scss.print.src)
  .pipe(sassGlob())
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sass({
    outputStyle: 'compressed',
  }).on('error', plugins.sass.logError))
  .pipe(plugins.postcss([
    plugins.autoprefixer(),
    plugins.cssMqpacker(),
  ]))
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest(PATHS.scss.print.dest))
);

gulp.task('scss', done => gulpMultiProcess([
  'scss:exports',
  'scss:critical',
  'scss:head',
  'scss:main',
  'scss:print',
], done));

gulp.task('widgets-files', ['webpack'], (done) => {
  templates()
    .then(() => {
      done();
    });
});

gulp.task('images', () => {
  const streams = [];

  streams.push(
    gulp.src('src/images/**/*.*')
      .pipe(plugins.rename({
        dir: '',
      }))
      .pipe(gulp.dest('dist/assets/images/'))
  );

  return plugins.mergeStream(...streams);
});

gulp.task('skins', () => {
  const streams = [];

  streams.push(
    gulp.src([
      'src/skins/*/*.png',
      'src/skins/*/*.ico',
      'src/skins/*/*.xml',
      'src/skins/*/*.js',
      '!src/skins/*/cp.js',
      '!src/skins/*/consent-layer.js',
      '!src/skins/*/consent-page.js',
      'src/skins/*/images/*',
    ])
      .pipe(plugins.rename((path) => {
        const dirFragments = path.dirname.replace(/\\/g, '/').split('/skins/');

        path.dirname = dirFragments.pop();
      }))
      .pipe(gulp.dest('dist/assets/skins/'))
  );

  streams.push(
    gulp.src(['src/skins/*/cp.js'])
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.babel({
        presets: ['env'],
      }))
      .pipe(plugins.rename((path) => {
        const dirFragments = path.dirname.replace(/\\/g, '/').split('/skins/');

        path.dirname = dirFragments.pop();
      }))
      .pipe(plugins.terser())
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/assets/skins/'))
  );

  streams.push(
    gulp.src(['src/skins/*/consent-layer.js', 'src/skins/*/consent-page.js'])
      .pipe(plugins.babel({
        presets: ['env'],
      }))
      .pipe(plugins.rename((path) => {
        const dirFragments = path.dirname.replace(/\\/g, '/').split('/skins/');

        path.dirname = dirFragments.pop();
      }))
      .pipe(plugins.terser())
      .pipe(gulp.dest('src/assets/skins/'))
  );

  return plugins.mergeStream(...streams);
});

gulp.task('woff', () =>
  gulp.src('src/fonts/woff/*.woff')
    .pipe(plugins.rename({
      dir: '',
    }))
    .pipe(gulp.dest(PATHS.fonts.dest))
);

gulp.task('woff2', () =>
  gulp.src('src/fonts/woff2/*.woff2')
    .pipe(plugins.rename({
      dir: '',
    }))
    .pipe(gulp.dest(PATHS.fonts.dest))
);

gulp.task('stylestats', () =>
  gulp.src('dist/assets/skins/rp-online/main.css')
    .pipe(plugins.stylestats({
      type: 'json',
      outfile: true,
    }))
    .pipe(gulp.dest('./src/stats/'))
);

gulp.task('transpile', () => {
  const streams = Object.keys(PATHS.js).filter(key => [
    'main',
    'serviceworker',
    'widgets',
    'noopServiceworker',
    'personalArea',
    'cp',
  ].indexOf(key) === -1).map(key =>
    gulp.src(PATHS.js[key].src)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.babel({
        presets: ['env'],
      }))
      .pipe(plugins.concatUtil(PATHS.js[key].dest), { newLine: ';' })
      .pipe(plugins.uglify({ compress: { drop_debugger: false } }))
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/assets'))
  );

  streams.push(
    gulp.src(PATHS.js.main.src)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.babel({
        presets: ['env'],
      }))
      .pipe(plugins.concatUtil(PATHS.js.main.dest, {
        sep: ';',
      }))
      .pipe(plugins.concatUtil.header('(function() { if (!window.park.mainLoaded) {\nwindow.park.mainLoaded = true;\n'))
      .pipe(plugins.concatUtil.footer('\n}\n}).apply(window, []);\n'))
      .pipe(plugins.uglify({ compress: { drop_debugger: false } }))
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/assets'))
  );

  streams.push(
    gulp.src(PATHS.js.main.src)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.concatUtil(PATHS.js.main.dest.replace('.js', '.es6.js'), {
        sep: ';',
      }))
      .pipe(plugins.concatUtil.header('(() => { if (!window.park.mainLoaded) {\nwindow.park.mainLoaded = true;\n'))
      .pipe(plugins.concatUtil.footer('\n}\n})();\n'))
      .pipe(plugins.terser())
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/assets'))
  );

  const merged = plugins.mergeStream(...streams);

  merged
    .on('end', () => {
      gulp.src('src/libs/custom-intersection-observer-polyfill/intersection-observer.js')
        .pipe(plugins.rename({
          dir: '',
          basename: 'intersection-observer-polyfill',
        }))
        .pipe(gulp.dest('dist/assets'));

      gulp.src('node_modules/babel-polyfill/dist/polyfill.min.js')
        .pipe(plugins.rename({
          dir: '',
          basename: 'es6-polyfill',
        }))
        .pipe(gulp.dest('dist/assets'));

      gulp.src('src/libs/custom-popper/popper.js')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.terser())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(plugins.rename({
          dir: '',
          basename: 'popper',
        }))
        .pipe(gulp.dest('dist/assets'));
    });

  return merged;
});

gulp.task('inlineassets', () => {
  const streams = [];
  streams.push(
    gulp.src('./dist/assets/head.js')
      .pipe(gulp.dest('./src/assets'))
  );

  streams.push(
    gulp.src(['src/skins/*/consent-layer.js', 'src/skins/*/consent-page.js'])
      .pipe(plugins.babel({
        presets: ['env'],
      }))
      .pipe(plugins.rename((path) => {
        const dirFragments = path.dirname.replace(/\\/g, '/').split('/skins/');

        path.dirname = dirFragments.pop();
      }))
      .pipe(plugins.terser())
      .pipe(gulp.dest('src/assets/skins/'))
  );

  return plugins.mergeStream(...streams);
});

gulp.task('serviceworker', () =>
  gulp.src('./src/js/serviceworker/*.js')
    .pipe(plugins.rename({
      dir: '',
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(plugins.gzip())
    .pipe(gulp.dest('./dist'))
);

gulp.task('iframeresizer', () =>
  gulp.src(PATHS.js.iframeresizer.src)
    .pipe(gulp.dest('./dist/assets'))
);

gulp.task('adblockdetection', () =>
  gulp.src(PATHS.js.adblockdetection.src)
    .pipe(gulp.dest('./dist/assets'))
);

gulp.task('assets', () =>
  gulp.src('./src/**/ajax/*.json')
    .pipe(plugins.rename((path) => {
      const dirFragments = path.dirname.replace(/\\/g, '/').split('/');

      path.dirname = dirFragments[1];
    }))
    .pipe(gulp.dest('./dist/assets/ajax'))
);

gulp.task('ajax', () =>
  gulp.src('./src/**/ajax/*')
    .pipe(plugins.rename((path) => {
      const dirFragments = path.dirname.replace(/\\/g, '/').split('/');

      path.dirname = dirFragments[1];
    }))
    .pipe(gulp.dest('./dist/assets/ajax'))
);

gulp.task('compress:css', () => {
  gulp.src(['./dist/assets/**/*.css', '!./dist/assets/**/*.critical.css'])
    .pipe(plugins.gzip())
    .pipe(gulp.dest('./dist/assets'));
});

gulp.task('compress:js', () => {
  gulp.src('./dist/assets/*.js')
    .pipe(plugins.gzip())
    .pipe(gulp.dest('./dist/assets'));

  gulp.src('./src/js/serviceworker/serviceworker.js')
    .pipe(plugins.gzip())
    .pipe(gulp.dest('./dist'));
});

gulp.task('compress:html', () => {
  gulp.src('./dist/*.html')
    .pipe(plugins.gzip())
    .pipe(gulp.dest('./dist'));
});

gulp.task('compress:widgets-files', ['widgets-files'], () => {
  gulp.src('./dist/assets/widgets/templates.json')
    .pipe(plugins.gzip())
    .pipe(gulp.dest('./dist/assets/widgets'));
});

gulp.task('compress:svg-sprites', ['svg-bitmap-sprites'], () => {
  gulp.src('./dist/assets/images/*.svg')
    .pipe(plugins.gzip())
    .pipe(gulp.dest('./dist/assets/images'));
});

gulp.task('documentation', ['browser'], () => {
  const streams = [];

  streams.push(
    gulp.src('./node_modules/prismjs/components/*.js')
      .pipe(plugins.rename({
        dir: '',
      }))
      .pipe(gulp.dest('./dist/assets/prism/components'))
      .pipe(plugins.gzip())
      .pipe(gulp.dest('./dist/assets/prism/components'))
  );

  streams.push(
    gulp.src('./node_modules/prismjs/components.js')
      .pipe(plugins.rename({
        dir: '',
      }))
      .pipe(gulp.dest('./dist/assets/prism'))
      .pipe(plugins.gzip())
      .pipe(gulp.dest('./dist/assets/prism'))
  );

  streams.push(
    gulp.src('./node_modules/prismjs/prism.js')
      .pipe(plugins.rename({
        dir: '',
      }))
      .pipe(gulp.dest('./dist/assets/prism'))
      .pipe(plugins.gzip())
      .pipe(gulp.dest('./dist/assets/prism'))
  );

  streams.push(
    gulp.src('./node_modules/prismjs/themes/prism-twilight.css')
      .pipe(plugins.rename({
        dir: '',
        basename: 'prism',
      }))
      .pipe(gulp.dest('./dist/assets/prism'))
      .pipe(plugins.gzip())
      .pipe(gulp.dest('./dist/assets/prism'))
  );

  return plugins.mergeStream(...streams);
});

gulp.task('js-watch', ['transpile'], () =>
  plugins.browserSync.reload()
);

const floatPrecision = 2;

gulp.task('svg-bitmap-sprites', ['svg'], (done) => {
  const promises = [
    'navigation',
    'cities',
    'sportsclubs',
  ].map(group => sprites(`src/svg/${group}/*.svg`, `dist/assets/images/sprite.${group}.svg`, 45));

  Promise
    .all(promises)
    .catch((e) => {
      console.error('Error while compiling SVG bitmap spites.', e);
    })
    .then(() => {
      done();
    });
});

gulp.task('svg-sprites', ['svg'], () => {
  const streams = [];

  [
    'navigation',
    'cities',
    'sportsclubs',
  ].forEach((group) => {
    streams.push(
      gulp.src(`src/svg/${group}/*.svg`)
        .pipe(plugins.svgSprite({
          shape: {
            spacing: {
              padding: 0,
              box: 'icon',
            },
          },
          mode: {
            stack: {
              dest: '.',
              sprite: `sprite.${group}.svg`,
              bust: false,
            },
          },
        }))
        .pipe(gulp.dest('dist/assets/images/'))
    );
  });

  return plugins.mergeStream(...streams);
});

gulp.task('svg', () => {
  const streams = [];

  streams.push(
    gulp.src(PATHS.svg.src)
      .pipe(plugins.filterEach(content => content.indexOf('svgo:disable') === -1))
      .pipe(plugins.svgo({
        plugins: [
          {
            removeTitle: true,
          }, {
            removeDimensions: true,
          }, {
            removeUnknownsAndDefaults: false,
          }, {
            mergePaths: true,
          }, {
            cleanupIDs: false,
          }, {
            removeAttrs: {
              attrs: '(fill|data-[a-z]+)',
            },
          }, {
            cleanupNumericValues: {
              floatPrecision,
            },
          },
          {
            convertPathData: {
              floatPrecision,
            },
          },
          {
            convertTransform: {
              floatPrecision,
            },
          },
          {
            cleanupListOfValues: {
              floatPrecision,
            },
          },
        ],
      }))
      .pipe(gulp.dest(PATHS.svg.dest))
      .pipe(plugins.preservetime())
  );

  [
    'navigation',
    'cities',
    'sportsclubs',
  ].forEach((group) => {
    streams.push(
      gulp.src(`src/svg/${group}/*.svg`)
        .pipe(plugins.svgo({
          plugins: [
            {
              removeTitle: true,
            }, {
              removeDimensions: true,
            }, {
              removeUnknownsAndDefaults: false,
            }, {
              mergePaths: true,
            }, {
              cleanupIDs: false,
            }, {
              removeAttrs: {
                attrs: '(data-[a-z]+)',
              },
            }, {
              cleanupNumericValues: {
                floatPrecision,
              },
            },
            {
              convertPathData: {
                floatPrecision,
              },
            },
            {
              convertTransform: {
                floatPrecision,
              },
            },
            {
              cleanupListOfValues: {
                floatPrecision,
              },
            },
          ],
        }))
        .pipe(gulp.dest(`src/svg/${group}/`))
        .pipe(plugins.preservetime())
    );
  });

  return plugins.mergeStream(...streams);
});

gulp.task('manifests', (done) => {
  manifests()
    .then(() => {
      done();
    });
});

gulp.task('servesimple', () => {
  plugins.serve('dist');
});

gulp.task('serve', () => {
  plugins.browserSync.init({
    server: PATHS.server,
    port: 80,
  });
  // gulp.watch(PATHS.html.src).on('change', plugins.browserSync.reload);
});

gulp.task('lint:js', () => {
  const sources = Object
    .values(PATHS.js)
    .reduce((accumulator, entry) => accumulator.concat(entry.src), [])
    .concat('!node_modules/**');

  return gulp.src(sources)
    .pipe(plugins.plumber({
      errorHandler: onError,
    }))
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('lint:scss', () => {
  const sources = Object
    .values(PATHS.scss)
    .reduce((accumulator, entry) => accumulator.concat(entry.src), [])
    .concat([
      'src/components/*/*.scss',
    ]);

  return gulp.src(sources)
    .pipe(plugins.plumber({
      errorHandler: onError,
    }))
    .pipe(plugins.stylelint({
      reporters: [
        {
          formatter: 'string',
          console: true,
        },
      ],
    }));
});

gulp.task('lint:json', () =>
  gulp.src(PATHS.json.src)
    .pipe(plugins.plumber({
      errorHandler: onError,
    }))
    .pipe(plugins.jsonlint())
    .pipe(plugins.jsonlint.reporter())
);

gulp.task('widgets', ['webpack', 'compress:widgets-files']);
gulp.task('fonts', ['woff', 'woff2']);
gulp.task('compress', ['compress:css', 'compress:js']);

gulp.task('lint', done => gulpMultiProcess([
  'lint:scss',
  'lint:js',
  'lint:json',
], done));

gulp.task('templates', done => plugins.runSequence(
  ['inventory'],
  ['documentation'],
  ['pages'],
  done));
gulp.task('css', done => plugins.runSequence(
  ['scss'],
  ['compress:css'],
  ['del:non-critical-css'],
  done));
gulp.task('js', done => plugins.runSequence(
  ['transpile'],
  ['inlineassets'],
  ['compress:js'],
  done));

gulp.task('clean', () => plugins.del(['dist', 'src/assets', 'src/critical']));
gulp.task('del:compressed-html', () => plugins.del(['dist/*.html.gz']));
gulp.task('del:non-critical-css', () => plugins.del(['src/critical/skins/*/head.css']));

gulp.task('corebuild', done => plugins.runSequence(
  ['lint'],
  ['scss'],
  ['transpile'],
  ['inlineassets'],
  ['serviceworker', 'iframeresizer', 'adblockdetection', 'fonts', 'images'],
  ['compress:css', 'compress:js'],
  ['skins', 'manifests', 'widgets'],
  ['del:compressed-html'],
  ['components'],
  done));

gulp.task('templatesbuild', done => plugins.runSequence(
  ['corebuild'],
  ['templates'],
  ['ajax'],
  done));

gulp.task('build', done => plugins.runSequence(
  ['corebuild'],
  ['compress:svg-sprites'],
  done));

gulp.task('default', ['build', 'serve']);
