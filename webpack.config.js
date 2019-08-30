var path = require('path');
var webpack = require('webpack');
//var HtmlWebpackPlugin = require('html-webpack-plugin');
//const ExtractTextPlugin = require("extract-text-webpack-plugin")
//const {CleanWebpackPlugin} = require('clean-webpack-plugin');
module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry:'./src/index.js',
  output: {
    filename: 'dist/main.js',
    library: 'nsc-components-ss',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader',
        
      },
      
      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'less-loader',
          { loader: 'less-loader', options: { javascriptEnabled: true } }
        ]
      },
      {
        test: /\.css$/,
        use: [{
          loader: "style-loader"
        }, 
        {
          loader: 'css-loader',
          options:{ 
            modules: {
              mode: 'local',
              localIdentName: '[name]-[local]',
            },
          }
        }
        ]
      },
      
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),
    //new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    //new ExtractTextPlugin('css/[name].css')
    // new HtmlWebpackPlugin({
    //   template: './test/index.html'
    // })
  ],
  // devServer: {
  //   // contentBase: path.join(__dirname, 'examples'),
  //   compress: true, // 开启gzip
  //   host: '0.0.0.0',
  //   port: 9100,
  //   // hot: true,
  //   clientLogLevel: 'warning',
  //   watchContentBase: true,
  //   quiet: false,
  //   staticOptions: {
  //     redirect: false
  //   },
  // }
}