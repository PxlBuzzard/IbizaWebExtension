const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin}  = require('vue-loader');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = (env, argv) => {

  const config = {
    entry: {
      popup: './src/popup/index.js'
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
              // the "scss" and "sass" values for the lang attribute to the right configs here.
              // other preprocessors should work out of the box, no loader config like this necessary.
              'scss': 'vue-style-loader!css-loader!sass-loader',
              'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
            }
            // other vue-loader options go here
          }
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        }
      ]
    },
    devServer: {
      historyApiFallback: true,
      noInfo: true
    },
    performance: {
      hints: false
    },
    devtool: 'cheap-module-source-map',
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'assets', to: 'assets' },
          { from: 'manifest.json', to: 'manifest.json' },
        ]
      }),
      new HtmlWebpackPlugin({
        title: 'Popup',
        template: './src/popup/index.html',
        filename: 'index.html',
      }),
      new ZipPlugin({
        path: '..',
        filename: 'extension.zip'
      }),
    ]
  };

  if (argv.module === 'production') {
    config.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    config.plugins = (config.plugins || []).concat([
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    ]);
  }

  return config;
}
