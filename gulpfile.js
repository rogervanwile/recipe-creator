"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");

sass.compiler = require("node-sass");

gulp.task("copy-js", function () {
  return gulp
    .src(["node_modules/handlebars/dist/handlebars.js", "./src/js/admin.js"])
    .pipe(concat("admin.js"))
    .pipe(gulp.dest("./build"));
});

gulp.task("sass:admin", function () {
  return gulp.src("./src/styles/admin.scss").pipe(sass().on("error", sass.logError)).pipe(gulp.dest("./build"));
});

gulp.task("sass:watch", function () {
  gulp.watch("./src/styles/**/*.scss", gulp.series("sass:admin"));
});

gulp.task("watch", function () {
  gulp.watch("./src/styles/**/*.scss", gulp.series("sass:admin"));
  gulp.watch("./src/js/*.js", gulp.series("copy-js"));
});

gulp.task("build", gulp.series("copy-js", "sass:admin"));
