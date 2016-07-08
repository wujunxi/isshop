/**
 * Created by wujx on 2016/6/13.
 */
var gulp = require('gulp'),
    jade = require('gulp-jade'),
    del = require('del'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css');

var isDebug = true;

var root = '../frontend/';

var src_path = {
    images: root + 'src/images/**/*',
    scripts: root + 'src/scripts/**/*',
    login: root + 'src/login'
};

var dest_path = {
    images: root + 'public/images',
    scripts: root + 'public/scripts',
    login:root + 'public/login'
};

gulp.task('clean', function (cb) {
    del([root + 'public/**']).then(function(paths){
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
    cb();
});

gulp.task('images', function (cb) {
    gulp.src(src_path.images).pipe(gulp.dest(dest_path.images));
    cb();
});

gulp.task('scripts', function (cb) {
    gulp.src(src_path.scripts).pipe(gulp.dest(dest_path.scripts));
    cb();
});

gulp.task('base', ['images', 'scripts'], function (cb) {
    //gulp.src('../frontend/src/favicon.ico').pipe(gulp.dest('../frontend/public'));
    cb();
});

// 登录模块
gulp.task('login', function (cb) {
    gulp.src(src_path.login + '/*.jade')
        .pipe(jade({basedir: root + 'src', pretty: isDebug}))
        .pipe(gulp.dest(root + 'public'));
    gulp.src(src_path.login + '/css/*.less')
        .pipe(less({paths: root + 'src'})) // 设置根路径
        //.pipe(minifycss())
        .pipe(gulp.dest(dest_path.login + '/css'));
    gulp.src(src_path.login + '/js/*.js')
        .pipe(gulp.dest(dest_path.login + '/js'));
    cb();
});

gulp.task('watch', function () {
    gulp.watch(['../frontend/src/css/**/*', '../frontend/src/includes/**/*', '../frontend/src/scripts/**/*', '../frontend/src/template/**/*', '../frontend/src/login/**/*'], ['login']);
});

gulp.task('default', ['clean', 'base', 'login'], function () {

});