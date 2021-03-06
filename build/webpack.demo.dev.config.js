'use struct'
const utils = require('./utils')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, '../'),
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    app: './examples/main.js'
  },
  output: {
    path: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.scss'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': utils.resolve('examples'),
      '~': utils.resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => {
          return /node_modules/.test(file) &&
            !/\.vue\.js/.test(file)
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
        options: {
          emitWarning: true
        }
      },
      {
        test: /\.scss$/,
        loaders: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.md$/,
        loader: 'vue-markdown-loader',
        options: {
          use: [
            [require('markdown-it-container'), 'demo', {
              validate: function (params) {
                return params.trim().match(/^demo\s*(.*)$/)
              },

              render: function (tokens, idx) {
                const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
                if (tokens[idx].nesting === 1) {
                  let desc = m[1].length > 0 ? `<div class="fly-demo-block__desc">${m[1]}</div>` : ``
                  let content = tokens[idx + 1].content

                  return `<fly-demo-block>
                                <div slot='effect'>${content}</div>
                                <div slot='code'>${desc}
                            `
                } else {
                  return `</div></fly-demo-block>`
                }
              }
            }],
            [require('markdown-it-container'), 'log', {
              validate: function (params) {
                return params.trim().match(/^log\s*(.*)$/)
              },
              render: function (tokens, idx) {
                const m = tokens[idx].info.trim().match(/^log\s*(.*)$/)

                if (tokens[idx].nesting === 1) {
                  let desc = m[1].length > 0 ? `<div>${m[1]}</div>` : ``
                  let content = tokens[idx + 1].content
                  return `<fly-timeline-item timestamp='${content}'>${desc}`
                } else {
                  return `</fly-timeline-item>`
                }
              }
            }]
          ],
          preprocess: function (MarkdownIt, source) {
            MarkdownIt.renderer.rules.table_open = function () {
              return '<table class="fly-demo-table">'
            }
            return source
          }
        }
      }
    ]
  },
  devServer: {
    // host: '192.168.66.127',
    host: 'localhost',
    hot: true,
    clientLogLevel: 'warning',
    compress: true,
    progress: true,
    port: '8080',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './examples/index.ejs',
      favicon: './examples/favicon.ico',
      inject: true
    })
  ]
}
