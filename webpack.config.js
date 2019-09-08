module.exports = {
  mode: 'development',
  target: 'node',
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    filename: 'slims-api.js',
    library: 'slims-api',
    libraryTarget: 'umd'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
};
