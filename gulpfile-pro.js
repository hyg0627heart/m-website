const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const webpackStream = require('webpack-stream');
const rev = require("gulp-rev");
const revCollector = require("gulp-rev-collector");
const clean = require('del');


function copyHtml() {
  return src('./src/*.html')
    .pipe(dest("./dist/"))
}


function compileJs() {
  return webpackStream({
    mode: "production",
    entry: './src/app.js',
    // devtool: 'source-map',
    output: {
      filename: "app.min.js"
    },
    module: {
      rules: [
        {
          test: /\js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        },
        {
          test: /\.html$/,
          loader: "string-loader"
        }
      ]
    }
  })
    .pipe(rev())
    .pipe(dest('./dist/js/'))
    .pipe(rev.manifest("js-manifest.json"))
    .pipe(dest('./rev/'))
}




function compileCss() {
  return src('./src/style/*.scss')
    .pipe(sass().on('error', sass.logError))
    // .pipe(concat("app.min.css"))
    .pipe(rev())
    .pipe(dest('./dist/style/'))
    .pipe(rev.manifest("css-manifest.json"))
    .pipe(dest('./rev/'))
}





function copyFonts() {
  return src("./src/style/fonts/*.*")
    .pipe(dest("./dist/style/fonts/"));
}

function copyLibs() {
  return src("./src/libs/*.*")
    .pipe(dest("./dist/js/libs/"));
}

function copyImages() {
  return src("./src/images/*.*")
    .pipe(dest("./dist/images/"));
}


function revCol() {
  return src(['./rev/*.json', './dist/*.html'])
    .pipe(revCollector({
      replaceReved: true,
      dirReplacements: {
        '/style/': '/style/',
        '/js/': '/js/',
        'cdn/': function (manifest_value) {
          // return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
        }
      }
    }))
    .pipe(dest('./dist/'));
}


function del(path) {
  return function () {
    return clean(path);
  }
}

exports.default = series(del('./dist/'), parallel(copyFonts, copyImages, copyLibs, compileJs, copyHtml, compileCss), revCol);