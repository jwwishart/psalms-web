
var gulp = require("gulp"),
	tsc = require("gulp-tsc"),
	concat = require("gulp-concat"),
	uglify = require("gulp-uglify"),
	clean = require("gulp-clean"),
	rename = require("gulp-rename");

gulp.task("clean", function() {
	return  gulp.src('dist', {read: false})
				.pipe(clean());
});

gulp.task("compile-concat-typescript", ["clean"], function() {
	return  gulp.src("scripts/*.ts")
				// Build TypeScript
				.pipe(tsc({
					target: "ES5",
					module: "amd"
				}))

				// Concat
				.pipe(concat("script.js"))

				// Outpus
				.pipe(gulp.dest("dist"));
});

gulp.task("compress", ["clean", "compile-concat-typescript"], function() {
	return  gulp.src("dist/script.js")
				.pipe(uglify())
				.pipe(rename("script.min.js"))
				.pipe(gulp.dest('dist'));
});

gulp.task("build", ["clean", "compile-concat-typescript", "compress"], function() {
});

gulp.task("default", ["build"], function() {

});
