'use strict'

const webpack = require('webpack')
const path = require('path')

const babel = {
  presets: [
    'es2015',
    'stage-0',
    'react'
  ].map((n) => require.resolve(`babel-preset-${n}`))
}

module.exports = {
  entry: [
    require.resolve('babel-polyfill'),
    path.resolve('src/app/index.js')
  ],
  output: {
    filename: 'index.js',
    path: path.resolve('./build/js')
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ],
    alias: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      'libp2p-ipfs': 'libp2p-ipfs-browser',
      'node-forge': path.resolve(
        path.dirname(require.resolve('libp2p-crypto')),
        '../vendor/forge.bundle.js'
      )
    }
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../node_modules')
    ]
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules|vendor/,
      loader: 'babel',
      query: babel
    }, {
      test: /\.js$/,
      include: /node_modules\/(hoek|qs|wreck|boom|ipfs|promisify-es|whatwg-fetch|node-fetch|isomorphic-fetch|db\.js|redux|ethereum|lodash-es)/,
      loader: 'babel',
      query: babel
    }, {
      test: /\.js$/,
      include: /node_modules\/cbor/,
      loader: 'babel',
      query: {
        plugins: [
          // All things supported by node >= 4.0
          'babel-plugin-transform-es2015-template-literals',
          'babel-plugin-transform-es2015-literals',
          'babel-plugin-transform-es2015-function-name',
          'babel-plugin-transform-es2015-arrow-functions',
          'babel-plugin-transform-es2015-block-scoped-functions',
          'babel-plugin-transform-es2015-classes',
          'babel-plugin-transform-es2015-object-super',
          'babel-plugin-transform-es2015-shorthand-properties',
          'babel-plugin-transform-es2015-duplicate-keys',
          'babel-plugin-transform-es2015-computed-properties',
          'babel-plugin-transform-es2015-for-of',
          // 'babel-plugin-transform-es2015-sticky-regex',
          // 'babel-plugin-transform-es2015-unicode-regex',
          'babel-plugin-check-es2015-constants',
          // 'babel-plugin-transform-es2015-spread',
          // 'babel-plugin-transform-es2015-parameters',
          // 'babel-plugin-transform-es2015-destructuring',
          'babel-plugin-transform-es2015-block-scoping',
          'babel-plugin-transform-es2015-typeof-symbol',
          // 'babel-plugin-transform-es2015-modules-commonjs',
          'babel-plugin-transform-regenerator'
        ].map((p) => require.resolve(p))
      }
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.js$/,
      loader: 'transform?brfs',
      enforce: 'left'
    }, {
      test: /\.less$/,
      loader: 'style!css!less'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.woff2?(\?\S*)?$/,
      loader: 'url-loader?mimetype=application/font-woff'
    }, {
      test: /\.ttf(\?\S*)?$/,
      loader: 'url-loader?mimetype=application/octet-stream'
    }, {
      test: /\.otf(\?\S*)?$/,
      loader: 'url-loader'
    }, {
      test: /\.eot(\?\S*)?$/,
      loader: 'url-loader'
    }]
  },
  externals: {
    net: '{}',
    fs: '{}',
    tls: '{}',
    console: '{}',
    'require-dir': '{}',
    ursa: '{}',
    mkdirp: '{}',
    glob: '{}',
    'simple-websocket-server': '{}'
  },
  node: {
    Buffer: true
  },
  plugins: [
    new webpack.DefinePlugin(
      {'fs.writeSync': false}
    ),
    new webpack.optimize.DedupePlugin()
  ],
  devtool: 'inline-source-map'
}
