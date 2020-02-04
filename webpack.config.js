const path = require('path');
const webpack = require('webpack');
const entry = require('webpack-glob-entry');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: entry('./src/widgets/**/*.js'),

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/assets/widgets'),
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    new UglifyJSPlugin({
      sourceMap: true,
    }),
    new CompressionPlugin(),
    // new BundleAnalyzerPlugin(),
  ],

  module:
  {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
    ],
  },

  devtool: 'source-map',
};
