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
      plugins: ['karma-chrome-launcher','karma-firefox-launcher','karma-chai', 'karma-mocha','karma-webpack','karma-typescript-preprocessor2'],
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
      browsers: ['Firefox'], // You may use 'ChromeCanary', 'Chromium' or any other supported browser
      singleRun: true,
      concurrency: Infinity,
      captureTimeout: 60000,
    });
  };