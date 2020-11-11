"use strict";

var gulp = require("gulp");

gulp.task("copy-js", function () {
  return gulp.src("./src/js/*.js").pipe(gulp.dest("./build"));
});

gulp.task("build", gulp.series("copy-js"));
