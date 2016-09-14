'use strict'

const spawnNode = require('./libp2p-node')
const parallel = require('run-parallel')
const ethTx = require('ethereumjs-tx')
const EE = require('events').EventEmitter
const util = require('util')
const lp = require('pull-length-prefixed')
const pull = require('pull-stream')

exports = module.exports
exports.Node = EthereumNode

util.inherits(EthereumNode, EE)

function EthereumNode () {
  if (!(this instanceof EthereumNode)) {
    return new EthereumNode()
  }

  EE.call(this)

  this.libp2p = null

  this.start = (callback) => {
    parallel([
      (cb) => {
        spawnNode((err, libp2pNode) => {
          if (err) {
            return cb(err)
          }
          this.libp2p = libp2pNode
          mountTxProtocol(this, this.libp2p)
          cb()
        })
      }
    ], callback)
  }

  this.stop = (callback) => {
    parallel([
      (cb) => {
        this.libp2p.stop(cb)
      }
    ], callback)
  }

  this.sendTx = (peerInfo, tx, callback) => {
    // TODO
    //   Dial on proto
    //   serialize
    //   send tx
  }
}

function mountTxProtocol (ethereumNode, libp2pNode) {
  libp2pNode.handle('/ethereum/tx', (conn) => {
    pull(
      conn,
      lp,
      pull.collect((err, txs) => {
        if (err) {
          console.log(err)
          return
        }
        // TODO deserialize and emit each transaction
      })
    )
  })
}
