const gulp = require('gulp');
const gulpTs = require('gulp-typescript');
const gulpTslint = require('gulp-tslint');
const del = require('del');
const runSequence = require('run-sequence');

const tsProject = gulpTs.createProject('./tsconfig.json');

gulp.task('clean', () => {
    return del('./dist/');
});

gulp.task('tslint', () => {
    return gulp.src(['./src/**/*.ts', './spec/**/*.spec.ts', './examples/**/*.ts'])
        .pipe(gulpTslint({
            formatter: 'verbose'
        }))
        .pipe(gulpTslint.report());
});

gulp.task('ts', () => {
    return tsResult = tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('./dist/'));
});

gulp.task('declaration', () => {
    return tsResult = gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .dts
        .pipe(gulp.dest('./dist/src/'));
});

gulp.task('default', () => {
    const tasks = ['tslint', 'clean', 'ts', 'declaration'];
    runSequence.apply(runSequence, tasks);
});
