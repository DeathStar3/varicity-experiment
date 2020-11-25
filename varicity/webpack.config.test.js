module.exports = {
    entry: './src/main.ts',
    output: {
      filename: 'dist/bundle.js'
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