
(function() {
    "use strict";

    var gulp    = require("gulp"),
        concat  = require("gulp-concat"),
        uglify  = require("gulp-uglify"),
        clean   = require("gulp-clean"),
        rename  = require("gulp-rename");


    var paths = {
        dist: "dist",

        outputFile: "psalms.js",
        outputMinFile: "psalms.min.js",

        scripts: [
            "scripts/cornerstone.js",
            "scripts/psalms.js",
            "scripts/psalms.data.js"
        ]
    };

    gulp.on('err', function(err){
      console.log(err);
    });


    // TASKS ------------------------------------------------------------------
    //


    gulp.task("clean", function() {
        return  gulp.src(paths.dist, {read: false})
                    .pipe(clean());
    });

    //gulp.task("compile-concat-typescript", ["clean"], function() {
    //  return  gulp.src("scripts/*.ts")
    //              // Build TypeScript
    //              .pipe(tsc({
    //                  target: "ES5",
    //                  module: "amd"
    //              }))
    //
    //              // Concat
    //              .pipe(concat("script.js"))
    //
    //              // Outpus
    //              .pipe(gulp.dest("dist"));
    //});

    gulp.task("concat", ["clean"], function() {
        return  gulp.src(paths.scripts)
                    .pipe(concat(paths.outputFile))
                    .pipe(gulp.dest(paths.dist));
    });

    gulp.task("compress", ["clean", "concat"], function() {
        return  gulp.src(paths.dist + "/" + paths.outputFile)
                    .pipe(uglify())
                    .pipe(rename(paths.outputMinFile))
                    .pipe(gulp.dest(paths.dist));
    });

    gulp.task("package", function() {
        return  gulp.src(paths.scripts)
                    .pipe(concat(paths.outputFile))
                    .pipe(gulp.dest(paths.dist))
                    .pipe(rename(paths.outputMinFile))
                    .pipe(uglify())
                    .pipe(gulp.dest(paths.dist));
    });

    gulp.task('scripts', function() {
    return gulp.src('scripts/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

    //gulp.task("build", ["clean", "concat", "compress"], function() { });
    gulp.task("default", ["build"], function() { });

}());
