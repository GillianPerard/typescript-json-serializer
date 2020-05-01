const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const gulpCopy = require('gulp-copy');

const project = ts.createProject('./tsconfig.build.json');

const destinationFolder = './dist/';

const clean = () => del(destinationFolder);

const transpile = () => {
    return project.src().pipe(project()).js.pipe(gulp.dest(destinationFolder));
};

const declare = () => {
    return gulp
        .src('src/**/*.ts')
        .pipe(project())
        .dts.pipe(gulp.dest(`${destinationFolder}`));
};

const copy = () => {
    const sourceFiles = ['./package.json', './LICENSE', './README.md'];
    return gulp.src(sourceFiles).pipe(gulpCopy(`${destinationFolder}`));
};

const build = done => gulp.series(clean, transpile, declare, copy)(done);

const tasks = [clean, transpile, declare, build, copy];

tasks.forEach(t => {
    gulp.task(t);
});
