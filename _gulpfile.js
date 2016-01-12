var gulp = require('gulp'),
    del = require('del'),
    $ = require('gulp-load-plugins')(),
    php = require('gulp-connect-php'),
    runSequence = require('run-sequence'),
    rename = require("gulp-rename"),
    reveasy = require("gulp-rev-easy"),
    browserSync = require('browser-sync');

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

var reload  = browserSync.reload;

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
        ,'!app/php/**/*.php'
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


gulp.task('php', function() {
    php.server({ base: 'app', port: 8010, keepalive: true});
});
gulp.task('browser-sync',['php'], function() {
    browserSync({
        proxy: '127.0.0.1:8010',
        port: 8080,
        open: true,
        notify: false
    });
});

gulp.task('servePHP', function () {
    gulp.watch(['app/php/*.php','app/php/includes/*.php'], [reload]);
});

gulp.task('default', ['clean'], function () {
    gulp.watch(['app/php/*.php','app/php/includes/*.php'], [reload]);
});