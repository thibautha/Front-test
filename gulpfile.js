var gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require("gulp-rename"),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concatCss = require('gulp-concat-css'),
    plumber = require('gulp-plumber');

//Watch task
gulp.task('watch',  function() {
    gulp.watch(['_www/sass/**/*.scss'], ['styles']);
});

gulp.task('dist', ['concat', 'minify'], function(){

});


gulp.task('styles', function() {
    gulp.src('_www/sass/main.scss')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            // .pipe(autoprefixer({
            //     browsers: ['last 5 versions']
            // }))
        .pipe(sourcemaps.write('maps/'))
        .pipe(gulp.dest('_www/sass/'))
        .pipe(notify({
            title: 'Scss',
            message: 'Scss Passed.',
        }));
});

gulp.task('concat', function() {
    gulp.src('_www/scripts/*.js')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
            .pipe(uglify())
            .pipe(rename({
                extname: '.min.js'
            }))
        .pipe(gulp.dest('_www/dist/'))
        .pipe(notify({
            title: 'Uglify',
            message: 'JS uglify.',
        }));
});

gulp.task('minify', function() {
    gulp.src('_www/sass/*.css')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(concatCss("main.css"))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('_www/dist'))
        .pipe(notify({
            title: 'Minify',
            message: 'Css mini'
        }));
});
