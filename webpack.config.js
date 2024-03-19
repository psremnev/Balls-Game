const path = require('path')
const webpack = require('webpack')
// плагин для копирования файлов
const CopyPlugin = require('copy-webpack-plugin')
// плагин для обработки относительных путей из tsconfig, example: ../store/slice/service vs store/slice/service
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.(?:js|jsx|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react']
          }
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(mp3|jpg|png)$/i,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, 'tsconfig.json')
      })
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'build', to: path.resolve(__dirname, 'docs') }, // copy build to GitHub Pages folder
        { from: 'index.html', to: path.resolve(__dirname, 'docs') } // copy index.html to GitHub Pages folder
      ]
    })
  ]
}
