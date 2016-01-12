    // HOW TO USE
//create task , give it a name , define the source, pipe everything else it has to do - minify, rename, copy etc, give destination for the output
// gulp.task('js',function(){
// return gulp.src('app/scripts/**/*.js')
//    .pipe(gulp.dest('app/public/scripts'))
//    .pipe(rename({suffix:'.min'}))
//    .pipe($.uglify({preserveComments: 'some'}))
//    .pipe(gulp.dest('app/public/scripts'))
//});
//
'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var reveasy = require("gulp-rev-easy");
var rename = require("gulp-rename");

var AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function () {
    return gulp.src('app/scripts/**/*.js') // Matches 'app/scripts/somedir/somefile.js' and resolves 'base' to 'app/scripts/'
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});
// Optimize Images
gulp.task('img', function () {
    return gulp.src('app/img/**/*')
        .pipe($.size({title: 'Img before optimisation:'}))
        .pipe($.imagemin({
            progressive: true, //for jpg
            interlaced: true // for gif
        }))
        .pipe(gulp.dest('app/public/img'))
        .pipe($.size({title: 'Img after optimisation:'}));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function () {
    return gulp.src([
        'app/html/**/*',
        '!app/html/**/*.html'
    ], {
        dot: true
    }).pipe(gulp.dest('app/public'))
        .pipe($.size({title: 'copy'}));
});
// Copy Web Fonts To Dist
gulp.task('fonts', function () {
    return gulp.src(['app/fonts/**'])
        .pipe(gulp.dest('app/public/fonts'))
        .pipe($.size({title: 'fonts'}));
});
// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src([
        'app/styles/*.scss',
        'app/styles/**/*.css'
    ])
        .pipe($.size({title: 'Styles before compression'}))
        .pipe($.changed('styles', {extension: '.scss'}))
        .pipe($.sass({
            precision: 10
        }))
        .on('error', console.error.bind(console))
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(gulp.dest('app/public/styles'))
        // Concatenate And Minify Styles
        .pipe(rename({suffix:'.min'}))
        .pipe($.if('*.css', $.csso()))
        .pipe(gulp.dest('app/public/styles'))
        .pipe($.size({title: 'Styles after compression'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
    var assets = $.useref.assets({searchPath: '{.tmp,app}'});

    return gulp.src('app/html/**/*.html')
        // version CSS based on date
        .pipe($.size({title: 'html before compression'}))
        .pipe(reveasy({
            revType: 'date',
            fileTypes: ['css']
        }))
        .pipe(assets)
        // Concatenate And Minify JavaScript
        .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
        // Remove Any Unused CSS
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        // Minify Any HTML
        .pipe($.if('*.html', $.minifyHtml({
            empty: true,
            comments: false,
            conditionals: true
        })))
        // Output Files
        .pipe(gulp.dest('app/public'))
        .pipe($.size({title: 'html after compression'}));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'public']));
//js
gulp.task('js',function(){
    return gulp.src('app/scripts/**/*.js')
        .pipe(gulp.dest('app/public/scripts'))
        .pipe(rename({suffix:'.min'}))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe(gulp.dest('app/public/scripts'))
});
// Watch Files For Changes & Reload
gulp.task('serve', ['styles'], function () {
    browserSync({
        notify: false,
        logPrefix: 'NINJA-DEV',
        // https: true,
        server: ['.tmp', 'app', 'app/html']
    });

    gulp.watch(['app/html/**/*.html'], reload);
    gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['jshint', reload]);
    gulp.watch(['app/img/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:public', ['default'], function () {
    browserSync({
        notify: false,
        logPrefix: 'NINJA-DEV',
        // https: true,
        server: 'public'
    });
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
    runSequence('styles', ['html', 'img', 'fonts', 'copy', 'js'], cb);
});