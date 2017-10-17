var gulp = require('gulp');
var browserSync = require('browser-sync');
var prxy        = require('http-proxy-middleware');
var argv        = require('yargs').argv;

var headlightUrl = 'https://headlightqa.paviasystems.com';

gulp.task('default', function () {
    if (argv) {
        if (argv.qa) {
            headlightUrl = 'https://headlightqa.paviasystems.com';
            console.log('====== Proxy');
            console.log('proxying to ', headlightUrl);
        } else if (argv.stg) {
            headlightUrl = 'https://headlightstg.paviasystems.com';
            console.log('====== Proxy');
            console.log('proxying to ', headlightUrl);
        } else if (argv.uat) {
            headlightUrl = 'https://headlightuat.paviasystems.com';
            console.log('====== Proxy');
            console.log('proxying to ', headlightUrl);
        }
    }
    var apiProx = prxy('/1.0', {
        target: headlightUrl,
        changeOrigin: true,
        logLevel: 'debug',
        cookieDomainRewrite: 'localhost'
      });
    browserSync({
      notify: false,
      port: 8888,
      ws: true,
      online: true,
      open: false,
      https: false,
      server: {
        index: 'index.html',
        baseDir: ['test', '.'],
        routes: {
          '/.tmp': '.tmp',
          '/test': 'test',
          '../': '.'
        },
        middleware: [apiProx]
      }
    });
});
