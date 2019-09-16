var path = require('path')
var webpack = require('webpack')
module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry:'./src/index.js',
  output: {
    filename: 'main.js',
    library: 'nsc-components',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader'
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
      new webpack.HotModuleReplacementPlugin(),
     ],
  }