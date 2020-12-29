const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },
  plugins: [
    new CompressWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}
