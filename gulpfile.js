var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
// Save a reference to the `reload` method
var reload      = browserSync.reload;


gulp.task('serve', function () {

    // Serve files from the root of this project
    browserSync.init({
    	port: 8000,
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("*.html").on("change", reload);
});