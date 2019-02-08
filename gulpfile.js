const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsLint = require('gulp-tslint');
const del = require('del');
const runSequence = require('run-sequence');

const project = ts.createProject('./tsconfig.json');

const destinationFolder = './dist/';

const clean = () => del(destinationFolder);

const lint = () => {
    return project
        .src()
        .pipe(tsLint({ configuration: "./tslint.json", formatter: "verbose" }))
        .pipe(tsLint.report())
}

const transpile = () => {
    return project
        .src()
        .pipe(project())
        .js
        .pipe(gulp.dest(destinationFolder))
}

const declare = () => {
    return tsResult = gulp
        .src('src/**/*.ts')
        .pipe(project())
        .dts
        .pipe(gulp.dest(`${destinationFolder}/src/`));
}

const build = (done) => gulp.series(lint, clean, transpile, declare)(done)

const tasks = [clean, lint, transpile, declare, build]

tasks.forEach(t => {
    gulp.task(t);
});
