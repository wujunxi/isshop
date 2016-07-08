/**
 * Created by wujx on 2016/6/13.
 */
var gulp = require('gulp'),
    jade = require('gulp-jade'),
    del = require('del'),
    less = require('gulp-less'),
    minify = require('gulp-minify'),
    minifycss = require('gulp-minify-css'),
    // path = require('path'),
    concat = require('gulp-concat');

var isDebug = true;

var root = '../frontend/';

var src_path = {
    template: root + 'src/template',
    images: root + 'src/images',
    scripts: root + 'src/scripts',
    includes: root + 'src/includes',
    login: root + 'src/login',
    css: root + 'src/css/**/*'
};

var dest_path = {
    images: root + 'public/images',
    scripts: root + 'public/scripts',
    login: root + 'public/login'
};

// 清理
gulp.task('clean', function (cb) {
    // 注意，非当前目录下需要设置force参数
    del([root + 'public/*'], {force: true}).then(function (paths) {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    }, cb);
});

// 图片
gulp.task('images', function (cb) {
    gulp.src(src_path.images + '/**/*').pipe(gulp.dest(dest_path.images));
    cb();
});

// 共用脚本
gulp.task('scripts', function (cb) {
    gulp.src(src_path.scripts + '/**/*').pipe(gulp.dest(dest_path.scripts));
    cb();
});

gulp.task('base', ['images', 'scripts'], function (cb) {
    //gulp.src(root + 'src/favicon.ico').pipe(gulp.dest(root + 'public'));
    cb();
});

// 登录模块
gulp.task('login', function (cb) {
    // jade
    gulp.src(src_path.login + '/*.jade')
        .pipe(jade({basedir: root + 'src', pretty: isDebug}))
        .pipe(gulp.dest(root + 'public'));
    // less
    gulp.src(src_path.login + '/css/*.less')
        .pipe(less({paths: root + 'src'})) // 设置根路径
        //.pipe(minifycss())
        .pipe(gulp.dest(dest_path.login + '/css'));
    // js
    gulp.src([src_path.scripts + '/require-config.js', src_path.login + '/js/login.js'])
        .pipe(concat('login.js')) // 合并js
        // .pipe(minify({
        //     ext:{min:'.min.js'}
        // }))
        .pipe(gulp.dest(dest_path.login + '/js'));
    cb();
});

// 监听
gulp.task('watch', function () {
    gulp.watch([
        src_path.css + '/**/*',
        src_path.includes + '/**/*',
        src_path.scripts + '/**/*',
        src_path.template + '/**/*',
        src_path.login + '/**/*'
    ], ['login']);
});

gulp.task('default', ['clean', 'base', 'login'], function () {

});