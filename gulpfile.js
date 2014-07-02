
(function() {
    "use strict";

    var gulp       = require("gulp"),
        concat     = require("gulp-concat"),
        uglify     = require("gulp-uglify"),
        clean      = require("gulp-clean"),
        rename     = require("gulp-rename"),
        es         = require("event-stream"),
        gulpIgnore = require("gulp-ignore");

    var paths = {
        dist: "dist",

        outputFile: "psalms.js",
        outputMinFile: "psalms.min.js",

        scripts: [
            "scripts/cornerstone.js",
            "scripts/psalms.js",
            "scripts/psalms.data.js",
            "scripts/boot.js",
            "scripts/main.js"
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

    gulp.task("package", ["clean", "move-vendor"], function() {
        return  gulp.src(paths.scripts)
                    .pipe(gulp.dest(paths.dist));
    });

    gulp.task("move-vendor", ["clean"], function(cb) {
        es.concat(
            gulp.src('lib/jquery/dist/jquery.min.js')
                       .pipe(rename('jquery.min.js'))
                       .pipe(gulp.dest(paths.dist)),

            gulp.src('lib/lodash/dist/lodash.min.js')
                       .pipe(rename('lodash.min.js'))
                       .pipe(gulp.dest(paths.dist)),

            gulp.src('lib/knockout/dist/knockout.js')
                       .pipe(rename('knockout.js'))
                       .pipe(gulp.dest(paths.dist))

        ).on('end', cb);
    });

    //gulp.task("build", ["clean", "concat", "compress"], function() { });
    gulp.task("default", ["package"], function() { });

}());
