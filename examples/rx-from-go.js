'use strict'

const eth = require('../src')
const multiaddr = require('multiaddr')
const lp = require('pull-length-prefixed')
const pull = require('pull-stream')
const Block = require('ethereumjs-block')

const node = new eth.Node()

node.start((err) => {
  if (err) {
    throw err
  }

  console.log('eth node started')
  console.log('libp2p listening on:')
  node.libp2p.peerInfo.multiaddrs.map((ma) => {
    console.log(ma.toString() +
        '/ipfs/' + node.libp2p.peerInfo.id.toB58String())
  })

  node.on('tx', (tx) => {
    console.log('sweet, I got a tx')
  })

  const ma = multiaddr('/ip4/127.0.0.1/tcp/4002/ipfs/QmYCxFF6LMSQQQxZLYGRGsaLs8stShMaW7eRRwzvUHNSqy')

  node.libp2p.dialByMultiaddr(ma, '/eth/allblocks', (err, conn) => {
    if (err) {
      throw err
    }
    pull(
      conn,
      lp.decode(),
      pull.drain((block) => {
        block = new Block(block)
        console.log(block.toJSON(true).header.number)
      }, () => {
        console.log('no more blocks')
      })
    )
  })
})

