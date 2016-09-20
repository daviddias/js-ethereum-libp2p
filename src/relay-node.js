'use strict'

const spawnNode = require('./spawn-libp2p-node')
const parallel = require('run-parallel')
const Transaction = require('ethereumjs-tx')
const rlp = require('rlp')
const EE = require('events').EventEmitter
const util = require('util')
const lp = require('pull-length-prefixed')
const pull = require('pull-stream')
const multiaddr = require('multiaddr')

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
          mountBlockSyncProtocol(this, this.libp2p)
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

function mountBlockSyncProtocol (ethereumNode, libp2pNode) {
  libp2pNode.handle('/eth/block/sync/1.0.0', (txConn) => {
    console.log('got relay request')
    const ma = multiaddr('/ip4/127.0.0.1/tcp/4002/ipfs/QmYCxFF6LMSQQQxZLYGRGsaLs8stShMaW7eRRwzvUHNSqy')

    libp2pNode.dialByMultiaddr(ma, '/eth/allblocks', (err, rxConn) => {
      if (err) {
        return console.log('missed dialing to go-ethereum', err)
      }

      pull(
        rxConn,
        txConn
      )
    })
  })
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
