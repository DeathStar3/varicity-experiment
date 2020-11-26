const path = require('path');

module.exports = {
    entry: {
      'main':'./src/main.ts',
      'parserTest':'./tests/parser.test.ts'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
            test: /\.ya?ml$/,
            type: "json",
            use: "yaml-loader",
            exclude: /node_modules/
        }
      ]
    },
    mode: "development"
  }