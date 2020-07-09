const { src, dest, series, parallel, watch } = require('gulp');
const webserver = require('gulp-webserver');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const webpackStream = require('webpack-stream');
const proxy = require('http-proxy-middleware');
// const path = require('path');

//  gulp.task('',[],function(){

//  })

function copyHtml() {
  return src('./src/*.html')
    .pipe(dest("./dev/"))
}

// function copyjs() {
//   return src('./src/*.js')
//     .pipe(dest("./dev/"))
// }

function compileJs() {
  return webpackStream({
    mode: "development",
    entry: { app: './src/app.js', search: './src/search.js' },
    devtool: 'source-map',
    output: {
      filename: "[name].min.js"
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
    .pipe(dest('./dev/js/'))
}


function compileCss() {
  return src('./src/style/*.scss')
    .pipe(sass().on('error', sass.logError))
    // .pipe(concat("app.min.css"))
    .pipe(dest('./dev/style/'))
}

function server() {
  return src('./dev/')
    .pipe(webserver({
      port: 8080,
      //热更新
      livereload: true,
      // directoryListing: true,
      //打开浏览器
      open: true,
      middleware: [
        proxy('/api', {
          //代理转向地址
          target: 'https://m.lagou.com',
          //是否跨域
          changeOrigin: true,
          //请求路径的重写
          pathRewrite: {
            '^/api/': ''
          }
        })
      ]
    }))
}

function watchFile() {
  watch(['./src/**/*.html'], copyHtml)
  watch(['./src/**/*.js', './src/view/*.*'], compileJs);
  watch('./src/style/*.scss', compileCss);
}

function copyFonts() {
  return src("./src/style/fonts/*.*")
    .pipe(dest("./dev/style/fonts/"));
}

function copyLibs() {
  return src("./src/libs/*.*")
    .pipe(dest("./dev/js/libs/"));
}

function copyImages() {
  return src("./src/images/*.*")
    .pipe(dest("./dev/images/"));
}

exports.default = series(parallel(copyFonts, copyImages, copyLibs, compileJs, copyHtml, compileCss), server, watchFile);