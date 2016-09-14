'use strict'

const libp2p = require('libp2p-ipfs')
const isNode = require('detect-node')
const _random = require('lodash.random')
const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const multiaddr = require('multiaddr')

module.exports = spawnNode

function spawnNode (peerInfo, callback) {
  if (typeof peerInfo === 'function') {
    callback = peerInfo
    peerInfo = undefined
  }

  if (!peerInfo) {
    const id = PeerId.create()
    peerInfo = new PeerInfo(id)

    if (isNode) {
      peerInfo.multiaddr.add(multiaddr('/ip4/127.0.0.1/tcp/0'))
      // until libp2p-websockets supports port 0
      const wsPort = _random(10000, 19000)
      peerInfo.multiaddr.add(multiaddr(`/ip4/127.0.0.1/tcp/${wsPort}/ws`))
    } else {
      const sig = multiaddr('/libp2p-webrtc-star/ip4/127.0.0.1/tcp/20000/ws')
      peerInfo.multiaddr.add(sig.encapsulate(`/ipfs/${id.toB58String()}`))
    }
  }

  const node = new libp2p.Node(peerInfo)

  node.start((err) => {
    if (err) {
      return callback(err)
    }
    callback(null, node)
  })
}
