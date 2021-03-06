var properties = {
  port: 8081, // LiveReload server port
  folders: {
    build: 'build', // Deploy folder
    src: 'src', // Dev folder
  }
}

var plugins = {
  js: [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/swiper/dist/js/swiper.jquery.min.js',
  ],
  css: [
    'bower_components/reset-css/reset.css',
    'bower_components/swiper/dist/css/swiper.min.css'
  ]
}

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer')
    babel = require('gulp-babel'),
    rigger = require('gulp-rigger'),
    watch = require('gulp-watch');

function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('scripts', function() {
  return gulp.src([properties.folders.src + '/scripts/app.js'])
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(babel())
    .on('error', onError)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(properties.folders.build + '/scripts'))
    .pipe(connect.reload());
});

gulp.task('vendor', function () {
	gulp.src(plugins.css)
	  .pipe(concat('vendor.css'))
	  .pipe(gulp.dest(properties.folders.build + '/styles/'));
	gulp.src(plugins.js)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(properties.folders.build + '/scripts/'));
});

gulp.task('pug', function() {
	gulp.src(properties.folders.src + '/views/*.pug')
      .pipe(pug({
        pretty: true
		}))
    .on('error', onError)
		.pipe(gulp.dest(properties.folders.build))
    .on('end', function(){
      gulp.src(properties.folders.build + '/**/*.html')
        .pipe(connect.reload());
    });
});

gulp.task('sass', function () {
	gulp.src(properties.folders.src + '/styles/main.scss')
    .pipe(sourcemaps.init())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(prefix("last 3 version", "> 1%", "ie 8", "ie 7"))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(properties.folders.build + '/styles'))
		.pipe(connect.reload());
});

gulp.task('image', function () {
    gulp.src(properties.folders.src + '/img/**/*.*')
        .pipe(gulp.dest(properties.folders.build + '/img'))
});

gulp.task('video', function () {
    gulp.src(properties.folders.src + '/video/**/*.*')
        .pipe(gulp.dest(properties.folders.build + '/video'))
});

gulp.task('font', function () {
    gulp.src(properties.folders.src + '/fonts/**/*.*')
        .pipe(gulp.dest(properties.folders.build + '/fonts'))
});

gulp.task('json', function () {
    gulp.src(properties.folders.src + '/json/**/*.*')
        .pipe(gulp.dest(properties.folders.build + '/json'))
});

gulp.task('server', function() {
  connect.server({
    port: properties.port,
		root: properties.folders.build,
		livereload: true
	});
});

gulp.task('build', [
    'pug',
    'sass',
    'scripts',
    'vendor',
    'image',
    'video',
    'font',
    'json'
]);

gulp.task('watch', function() {
  watch(properties.folders.src + '/views/**/*.pug', function() {
        gulp.start('pug');
  });
  watch(properties.folders.src + '/styles/**/*.scss', function() {
        gulp.start('sass');
  });
  watch(properties.folders.src + '/scripts/**/*.js', function() {
        gulp.start('scripts');
  });
  watch(properties.folders.src + '/img/**/*.*', function() {
        gulp.start('image');
  });
  watch(properties.folders.src + '/video/**/*.*', function() {
      gulp.start('video');
  });
  watch(properties.folders.src + '/font/**/*.*', function() {
      gulp.start('font');
  });
  watch(properties.folders.src + '/json/**/*.*', function() {
      gulp.start('json');
  });
});

gulp.task('default', ['build', 'server', 'watch']);
