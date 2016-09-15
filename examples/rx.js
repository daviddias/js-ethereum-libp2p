'use strict'

const eth = require('../src')
const Transaction = require('ethereumjs-tx')
const multiaddr = require('multiaddr')
const lp = require('pull-length-prefixed')
const pull = require('pull-stream')
const rlp = require('rlp')

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

  const ma = multiaddr('/ip4/10.0.1.12/tcp/4002/ipfs/QmYCxFF6LMSQQQxZLYGRGsaLs8stShMaW7eRRwzvUHNSqy')

  node.libp2p.dialByMultiaddr(ma, '/eth/tx', (err, conn) => {
    if (err) {
      throw err
    }
    pull(
      conn,
      lp.decode(),
      pull.through((tx) => {
        console.log(tx.length)
        const decoded = rlp.decode(tx)
        tx = new Transaction(decoded)
        if (tx.verifySignature()) {
          console.log('woot, got tx')
        }
      }),
      pull.onEnd(() => {})
    )
  })
})

