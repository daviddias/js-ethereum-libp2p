const ethereum = require('../../src')
const idJson = require('./id')
const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const multiaddr = require('multiaddr')

const id = PeerId.createFromJSON(idJson)
const info = new PeerInfo(id)
const ma = multiaddr('/ip4/127.0.0.1/tcp/44444')
const maWs = multiaddr('/ip4/127.0.0.1/tcp/44455/ws')
info.multiaddr.add(ma)
info.multiaddr.add(maWs) // otherwise it won't try to dial

const relayPeerIdJson = require('./../../test/data/relay-peer.json')
const relayId = PeerId.createFromJSON(relayPeerIdJson)
const relayma = multiaddr('/ip4/127.0.0.1/tcp/33333/ws')

const relayInfo = new PeerInfo(relayId)
relayInfo.multiaddr.add(relayma)

const node = new ethereum.Node()

node.start(info, (err) => {
  if (err) {
    throw err
  }

  console.log('🎧 Listening on:')
  node.libp2p.peerInfo.multiaddrs.forEach((ma) => {
    console.log(ma.toString() + '/ipfs/' + id.toB58String())
  })

  let running = false

  node.block.sync(relayInfo, (err) => {
    if (err) {
      throw err
    }
  })

  setTimeout(() => {
    setInterval(() => {
      if (running) {
        return
      }
      console.log('going to run the blockchain')
      running = true

      node.vm.runBlockchain((err) => {
        if (err) {
          throw err
        }
        running = false
        const currentHead = '0x' + node.blockchain.meta.rawHead.toString('hex')
        console.log('➔ Head', currentHead)
      })
    }, 2000)
  }, 2000)
})
