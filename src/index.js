'use strict'

const spawnNode = require('./libp2p-node')
const parallel = require('run-parallel')
const Transaction = require('ethereumjs-tx')
const rlp = require('rlp')
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

  this.setPrivateKey = (privateKey) => {
    this.ethPrivKey = privateKey
  }

  this.sendTx = (peerInfo, tx) => {
    tx.sign(this.ethPrivKey)

    this.libp2p.dialByPeerInfo(peerInfo, '/ethereum/tx', gotConn)

    function gotConn (err, conn) {
      if (err) {
        return callback(err)
      }

      pull(
        pull.values([
          tx.serialize()
        ]),
        lp.encode(),
        conn
      )
    }
  }

  this.sentTxToRelay = (peerInfo, tx) => {
    // TODO
  }
}

function mountTxProtocol (ethereumNode, libp2pNode) {
  libp2pNode.handle('/ethereum/tx', (conn) => {
    pull(
      conn,
      lp.decode(),
      pull.collect((err, txs) => {
        if (err) {
          return console.log(err)
        }

        txs.forEach((tx) => {
          const decoded = rlp.decode(tx)
          tx = new Transaction(decoded)
          if (tx.verifySignature()) {
            ethereumNode.emit('tx', tx)
          }
        })
      })
    )
  })
}
