let webpackConfig = require('./webpack.config.test')

module.exports = function(config) {
    config.set({
      basePath: '',
      frameworks: ['mocha','chai'],
      files: [
        { pattern: 'tests/*.test.ts', watched: false }
      ],
      exclude: [
      ],
      plugins: ['karma-chrome-launcher', 'karma-chai', 'karma-mocha'],
      preprocessors: {
        'tests/*.test.ts': [ 'webpack' ]
      },
      webpack: {
        // Any custom webpack configuration...
        module: webpackConfig.module,
        resolve: webpackConfig.resolve,
        mode: webpackConfig.mode
      },
      webpackMiddleware: {
        // Any custom webpack-dev-middleware configuration...
        noInfo: true
      },
      reporters: ['progress'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['Chrome', 'Chrome_without_security'], // You may use 'ChromeCanary', 'Chromium' or any other supported browser
      // you can define custom flags
      customLaunchers: {
        Chrome_without_security: {
          base: 'Chrome',
          flags: ['--disable-web-security', '--disable-site-isolation-trials']
        }
      },
      singleRun: true,
      concurrency: Infinity
    });
  };