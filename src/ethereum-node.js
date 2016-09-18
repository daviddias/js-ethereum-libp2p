'use strict'

const spawnNode = require('./spawn-libp2p-node')
const parallel = require('run-parallel')
const Transaction = require('ethereumjs-tx')
const rlp = require('rlp')
const EE = require('events').EventEmitter
const util = require('util')
const lp = require('pull-length-prefixed')
const pull = require('pull-stream')
const EthereumVM = require('./ethereum-vm')

exports = module.exports
exports.Node = EthereumNode

util.inherits(EthereumNode, EE)

function EthereumNode () {
  if (!(this instanceof EthereumNode)) {
    return new EthereumNode()
  }

  EE.call(this)

  this.libp2p = null

  this.vm = EthereumVM.create()

  this.start = (peerInfo, callback) => {
    if (typeof peerInfo === 'function') {
      callback = peerInfo
      peerInfo = undefined
    }
    parallel([
      (cb) => {
        spawnNode(peerInfo, (err, libp2pNode) => {
          if (err) {
            return cb(err)
          }
          this.libp2p = libp2pNode
          mountTxProtocol(this, this.libp2p)
          mountBlockProtocol(this, this.libp2p)
          onPeerSendKnownBlocks(this, this.libp2p)
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

  // blocks

  this.vm.on('block', (block) => {
    // TODO
    //  see the event the vm emits (maybe postBlock?)
    //  send this block to all of the connected peers
  })

  // TODO
  this.sendBlock = (peerInfo, block, callback) => {
  }

  // transactions

  this.sendTx = (peerInfo, tx, callback) => {
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

      callback()
    }
  }

  // TODO
  // this.sendTxToAll = (tx, callback) => {})

  // TODO make relay accept tx in the same protocol
  // no need to differentiate
  this.sentTxToRelay = (peerInfo, tx, callback) => {
    tx.sign(this.ethPrivKey)

    this.libp2p.dialByPeerInfo(peerInfo, '/ethereum/tx-relay', gotConn)

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

      callback()
    }
  }
}

/*
 * Receive blocks from other peers
 */
function mountBlockProtocol (ethereumNode, libp2pNode) {
  // Receive blocks
  libp2pNode.handle('/ethereum/block', (conn) => {
    pull(
      conn,
      lp.decode(),
      pull.drain((blockRlpEncoded) => {
        // TODO treat the blocks
        console.log('got block')
      }),
      pull.onEnd((err) => {
        if (err) {
          return console.log('block proto err:', err)
        }
      })
    )
  })
}

/*
 * Each time I connect to a new peer, send the blocks I have
 */
function onPeerSendKnownBlocks (ethereumNode, libp2pNode) {
  // Send blocks blocks
  libp2pNode.swarm.on('peer-mux-established', (peerInfo) => {
    // TODO
    //   send all the blocks I know
  })
}

function mountTxProtocol (ethereumNode, libp2pNode) {
  libp2pNode.handle('/ethereum/tx', (conn) => {
    pull(
      conn,
      lp.decode(),
      pull.collect((err, txs) => {
        if (err) {
          return console.log('receive tx err:', err)
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

