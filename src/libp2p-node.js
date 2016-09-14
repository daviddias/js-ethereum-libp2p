'use strict'

const libp2p = require('libp2p-ipfs')
const isNode = require('detect-node')
const _random = require('lodash.random')
const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const multiaddr = require('multiaddr')

module.exports = spawnNode

function spawnNode (callback) {
  const id = PeerId.create()
  const peer = new PeerInfo(id)
  if (isNode) {
    peer.multiaddr.add(multiaddr('/ip4/127.0.0.1/tcp/0'))
    // until libp2p-websockets supports port 0
    const wsPort = _random(10000, 19000)
    peer.multiaddr.add(multiaddr(`/ip4/127.0.0.1/tcp/${wsPort}/ws`))
  } else {
    const sig = multiaddr('/libp2p-webrtc-star/ip4/127.0.0.1/tcp/20000/ws')
    peer.multiaddr.add(sig.encapsulate(`/ipfs/${id.toB58String()}`))
  }

  const node = new libp2p.Node(peer)

  node.start((err) => {
    if (err) {
      return callback(err)
    }
    callback(null, node)
  })
}
