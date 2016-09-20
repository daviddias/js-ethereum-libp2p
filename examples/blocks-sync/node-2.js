const ethereum = require('../../src')
const idJson1 = require('./id-1')
const idJson2 = require('./id-2')
const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const multiaddr = require('multiaddr')

const id1 = PeerId.createFromJSON(idJson1)
const info1 = new PeerInfo(id1)
const ma1 = multiaddr('/ip4/127.0.0.1/tcp/12345')
info1.multiaddr.add(ma1)

const id2 = PeerId.createFromJSON(idJson2)
const info2 = new PeerInfo(id2)
const ma2 = multiaddr('/ip4/127.0.0.1/tcp/54321')
info2.multiaddr.add(ma2)

const node = new ethereum.Node()

node.start(info2, (err) => {
  if (err) {
    throw err
  }

  console.log('🎧 Listening on:')
  node.libp2p.peerInfo.multiaddrs.forEach((ma) => {
    console.log(ma.toString() + '/ipfs/' + id2.toB58String())
  })

  node.libp2p.dialByPeerInfo(info1, (err) => {
    if (err) {
      throw err
    }

    node.block.sync((err) => {
      if (err) {
        throw err
      }

      node.vm.runBlockchain((err) => {
        if (err) {
          throw err
        }

        const currentHead = '0x' + node.blockchain.meta.rawHead.toString('hex')
        console.log('➔ Head', currentHead)
      })
    })
  })
})
