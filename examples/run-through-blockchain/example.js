const ethereum = require('../../src')
const idJson = require('./../broadcast-blocks/id-1')
const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const multiaddr = require('multiaddr')
const Account = require('ethereumjs-account')
const Block = require('ethereumjs-block')
const async = require('async')
const thousand = require('./../../test/data/real-chain/first-1000-blocks.json')

const id = PeerId.createFromJSON(idJson)
const info = new PeerInfo(id)
const ma = multiaddr('/ip4/127.0.0.1/tcp/12345')
info.multiaddr.add(ma)

const node = new ethereum.Node()

node.start(info, (err) => {
  if (err) {
    throw err
  }

  console.log('🎧 Listening on:')
  node.libp2p.peerInfo.multiaddrs.forEach((ma) => {
    console.log(ma.toString() + '/ipfs/' + id.toB58String())
  })

  console.log('▇ Adding blocks')
  async.eachSeries(thousand.slice(1, 10), eachBlock, next)

  function eachBlock (raw, cb) {
    let block
    try {
      block = new Block(new Buffer(raw.slice(2), 'hex'))

      node.vm._blockchain.putBlock(block, cb)
    } catch (err) { cb(err) }
  }

  function next (err) {
    if (err) {
      throw err
    }

    console.log('⛓l Running through the blockchain')

    let lastBlock

    node.vm.on('beforeBlock', (block, callback) => {
      lastBlock = block
      // console.log('before', block.toJSON(true))
      // console.log('0x' + block.serialize().toString('hex'))
      //
      node.vm.trie.get(block.header.coinbase, (err, account) => {
        if (err) {
          throw err
        }
        const a = new Account(account)
        console.log('before', block.header.coinbase.toString('hex'), a.balance.toString('hex'))
        callback()
      })
    })

    node.vm.on('afterBlock', (block, callback) => {
      node.vm.trie.get(lastBlock.header.coinbase, (err, account) => {
        if (err) {
          throw err
        }
        const a = new Account(account)
        console.log('after', lastBlock.header.coinbase.toString('hex'), a.balance.toString('hex'))
        callback()
      })
      // console.log('after', block)
    })

    // won't do anything if there is not tx
    node.vm.on('beforeTx', (tx, callback) => {
      console.log('tx', tx.from, tx.to, tx.value)
      setTimeout(callback, 1000)
    })

    node.vm.runBlockchain((err) => {
      if (err) {
        throw err
      }
      node.vm.blockchain.getHead((err, block) => {
        if (err) {
          throw err
        }

        const currentHead = '0x' + node.vm._blockchain.meta.rawHead.toString('hex')
        console.log('➔ Head', currentHead)
      })
    })
  }
})
