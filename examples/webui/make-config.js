'use strict'

const createConfig = require('hjs-webpack')
const path = require('path')

module.exports = function makeConfig (isDev) {
  const config = createConfig({
    isDev: isDev,
    in: './app/scripts/index.js',
    out: './dist',
    output: {
      publicPath: ''
    },
    html: function (ctx) {
      return ctx.defaultTemplate({
        publicPath: ''
      })
    },
    clearBeforeBuild: '!(img|favicon.ico)'
  })

  // Handle js-ipfs-api
  config.module.loaders.push({
    test: /\.js$/,
    include: /node_modules\/(hoek|qs|wreck|boom|ipfs|lodash-es|promisify-es|orbit|logplease|crdts)/,
    loader: 'babel-loader'
  })

  config.module.postLoaders = config.module.postLoaders || []
  config.module.postLoaders.push({
    include: /ipfs/,
    test: /\.js$/,
    loader: 'transform?brfs'
  })

  config.externals = {
    // Needed for js-ipfs-api
    net: '{}',
    fs: '{}',
    tls: '{}',
    console: '{}',
    mkdirp: '{}',
    'require-dir': '{}'
  }

  config.node = config.node || {}
  config.node.Buffer = require.resolve('buffer')

  config.resolve = {
    alias: {
      http: 'stream-http',
      https: 'https-browserify',
      sinon: 'sinon/pkg/sinon',
      'libp2p-ipfs': 'libp2p-ipfs-browser',
      'node-forge': path.resolve(
        path.dirname(require.resolve('libp2p-crypto')),
        '../vendor/forge.bundle.js'
      )
    }
  }

  config.module.noParse = config.module.noParse || []

  return config
}
