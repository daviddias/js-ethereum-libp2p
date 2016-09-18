const ethereum = require('../../src')
const idJson = require('./id-2')
const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const multiaddr = require('multiaddr')

const id = PeerId.createFromJSON(idJson)
const info = new PeerInfo(id)
const ma = multiaddr('/ip4/127.0.0.1/tcp/54321')
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

  let counter = 0

  node.vm.on('afterBlock', (block) => {
    console.log('got block')
    if (++counter === 100) {
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
})
