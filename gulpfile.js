/**
 * Created by user on 2016/6/3.
 */
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');  // 根据设置浏览器版本自动处理浏览器前缀
var sass = require('gulp-sass');                  // sass
var csscomb = require('gulp-csscomb');            // 调整css顺序
var minifyCss = require('gulp-minify-css');       // 压缩CSS为一行
var htmlmin = require('gulp-htmlmin');            // 压缩html
var uglify = require('gulp-uglify');              // js压缩
var jshint = require('gulp-jshint');              // js检测
var browserify = require('gulp-browserify');      // 解决js依赖
var source = require('vinyl-source-stream');      // browserify
var imagemin = require('gulp-imagemin');          // 图片压缩
var concat = require('gulp-concat');              // 多个文件合并为一个
var rev = require('gulp-rev');                    // 增加md5后缀名
var revCollector = require('gulp-rev-collector'); // 路径替换
var rename = require('gulp-rename');              // 文件名替换
var append = require('gulp-rev-append');          // 给引用资源添加版本号（时间戳），去掉缓存
var livereload = require('gulp-livereload');      // 主动刷新页面
var webserver = require('gulp-webserver');        //web server的服务
//var connect = require('gulp-connect-proxy');

var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');

var projectName = 'temp/anchor-list';
var htmlUrl = 'html/temp-live-rank';
//处理css
gulp.task('css', function () {
  //gulp.src('./gulpTest/scss/*.scss')
  //.pipe(sass().on('error', sass.logError))
  gulp.src('./' + projectName + '/src/css/signup-m.css')
    .pipe(autoprefixer({ // 加css3前缀
      browsers: ['> 5%', 'iOS 7', 'not ie <= 8', 'Android >= 4.0'],
      cascade: true, //是否美化属性值 默认：true 像这样：
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg);
      remove: true //是否去掉不必要的前缀 默认：true
    }))
    .pipe(csscomb('./node_modules/csscomb/config/zen.json'))
    .pipe(concat('build.css'))
    //.pipe(minifyCss())
    //.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./' + projectName + '/dist/css/'));
});

gulp.task('css2', function () {
  //gulp.src('./gulpTest/scss/*.scss')
  //.pipe(sass().on('error', sass.logError))
  gulp.src(['./' + projectName + '/css/main-h5.css'])
    .pipe(autoprefixer({ // 加css3前缀
      browsers: ['> 5%', 'iOS 7', 'not ie <= 8', 'Android >= 4.0'],
      cascade: true, //是否美化属性值 默认：true 像这样：
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg);
      remove: true //是否去掉不必要的前缀 默认：true
    }))
    .pipe(csscomb('./node_modules/csscomb/config/zen.json'))
    .pipe(concat('build.css'))
   // .pipe(minifyCss())
  //  .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./' + projectName + '/dist/css/'));
});

// 处理js
gulp.task('script', function () {
  // 如果需要控制顺序src(['a.js','b.js'])
  gulp.src(['./' + projectName + '/src/js/mithril/mithril.js', './' + projectName + '/src/js/diagnose.js'])
    //.pipe(jshint())
    //.pipe(jshint.reporter('YOUR_REPORTER_HERE'))
    .pipe(concat('build.js'))
    .pipe(gulp.dest('./' + projectName + '/src'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./' + projectName + '/dist/js'))
});

//对某单个js进行压缩
gulp.task('script2', function () {
  // 如果需要控制顺序src(['a.js','b.js'])
  gulp.src(['./' + projectName + '/biliTiming/0.0.1/biliTiming.js'])
    //.pipe(jshint())
    //.pipe(jshint.reporter('YOUR_REPORTER_HERE'))
    //.pipe(concat('build.js'))
    //.pipe(gulp.dest('./' + projectName + '/src'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./' + projectName + '/dist/js/'))
});

// 处理html
gulp.task('htmlmin', function () {
  var options = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: false,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: false,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
  };
  gulp.src('./' + htmlUrl + '/index.html')
    .pipe(htmlmin(options))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./' + htmlUrl + '/'))
});

// 处理图片
gulp.task('images', function () {
  gulp.src('./' + projectName + '/src/img/*.*')
    .pipe(imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(gulp.dest('./' + projectName + '/dist/img'))
});

// 自动监控
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(['./' + projectName + '/dist/css/*.css', './' + projectName + '/dist/js/*.js', './' + projectName + '/index-h5-3.html'], function () {
    livereload.reload();
  });
});

// 飘柔自动监控
gulp.task('watch1', function () {
  livereload.listen();
  gulp.watch(['./' + projectName + '/css/*.css', './' + projectName + '/js/*.js', './*/index.html'],
    function () {
      livereload.reload();
    });
});

gulp.task('webserver',function(){
  connect.server({
    livereload:true,
    port:2323
  });
});

//gulp.task('connect', function () {
//  connect.server({
//    root: ['./app'],
//    middleware: function (connect, opt) {
//      return [
//        proxy('/api', {
//          target: 'http://localhost:3000',
//          changeOrigin: true
//        })
//      ]
//    }
//
//  });
//});
//
//gulp.task('webserver', function () {
//  gulp.src('work2/html')
//    .pipe(webserver({
//      livereload: true,
//      directoryListing: true,
//      open: true,
//      path: '/'
//    }));
//});

gulp.task('default', ['webserver','watch1']);