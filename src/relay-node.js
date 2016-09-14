'use strict'

const spawnNode = require('./spawn-libp2p-node')
const parallel = require('run-parallel')
const Transaction = require('ethereumjs-tx')
const rlp = require('rlp')
const EE = require('events').EventEmitter
const util = require('util')
const lp = require('pull-length-prefixed')
const pull = require('pull-stream')

exports = module.exports

exports.Node = RelayNode

util.inherits(RelayNode, EE)

function RelayNode () {
  if (!(this instanceof RelayNode)) {
    return new RelayNode()
  }

  EE.call(this)

  this.libp2p = null

  this.start = (multiaddrs, callback) => {
    parallel([
      (cb) => {
        spawnNode(multiaddrs, (err, libp2pNode) => {
          if (err) {
            return cb(err)
          }
          this.libp2p = libp2pNode
          mountRelayTxProtocol(this, this.libp2p)
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
}

function mountRelayTxProtocol (RelayNode, libp2pNode) {
  libp2pNode.handle('/ethereum/tx-relay', (conn) => {
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
            RelayNode.emit('tx', tx)
          }
        })
      })
    )
  })
}
