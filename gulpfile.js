var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var jshint = require('gulp-jshint');
var cache = require('gulp-cache');
var changed = require('gulp-changed');
var _ = require('underscore');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var handlebars = require('gulp-handlebars')
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');

var testSrc = ['./spec/spec_helper.js', './spec/*_spec.js', './dist/tests/templates.js', './spec/support/*.js'];
var appSrc = ['./src/js/*.js'];
var templateSrc = ['./spec/templates/*.hbs'];
var allSrc = _.flatten(testSrc, appSrc, templateSrc);


gulp.task('package:test-templates', function() {
  return gulp.src('spec/templates/*.hbs')
  //.pipe(changed('./dist/tests'))
  .pipe(handlebars())
  .pipe(wrap('Handlebars.template(<%= contents %>)'))
  .pipe(declare({
    namespace: 'HandlebarsTemplates',
    noRedeclare: true,
  }))
  .pipe(concat('templates.js'))
  .pipe(gulp.dest('./dist/tests'))
});

gulp.task('package:tests', ['package:test-templates'], function() {
  return gulp.src(testSrc)
    //.pipe(changed('./dist/tests'))
    .pipe(sourcemaps.init())
    .pipe(concat('tests.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/tests'))
});

gulp.task('package:src', function() {
  return gulp.src(appSrc)
//  .pipe(changed('./dist/'))
  .pipe(sourcemaps.init())
  .pipe(concat('goodposture.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./dist/'))
});

gulp.task('test', ['package:tests', 'package:src'], function() {
  return gulp.src('spec/runner.html')
  .pipe(mochaPhantomJS());
});

gulp.task('clean:tests', function(cb) {
  del(['dist/tests'], cb);
})

gulp.task('watch:tests', function() {
  gulp.watch(allSrc, ['test']).on('change', function(event){
    console.log("re-running " + event.path)
  });
});

gulp.task('lint', function() {
  gulp.src(['/src/js/*.js', 'spec/*_spec.js'])
    .pipe(cache(jshint(),
      {key: makeHashKey,
        success: function(jshintedFile){
          return jshintedFile.jshint.success;
        },
        value: function(jshintedFile) {
          return { jshint: jshintedFile.jshint}
        }
      })
    )
    .pipe(jshint.reporter('default'))
});

function makeHashKey(file) {
  return [file.contents.toString('utf8')].join('');
}
