'use strict'

const multiaddr = require('multiaddr')
const PeerInfo = require('peer-info')
const PeerId = require('peer-id')
const Relay = require('./../../src').Relay

spawnNode((err, node) => {
  if (err) {
    throw err
  }
  console.log('Relay started')
})

function spawnNode (callback) {
  const relayPeerIdJson = require('./../../test/data/relay-peer.json')
  const id = PeerId.createFromJSON(relayPeerIdJson)
  const maTCP = multiaddr('/ip4/127.0.0.1/tcp/35533')
  const maWS = multiaddr('/ip4/127.0.0.1/tcp/33333/ws')

  const peer = new PeerInfo(id)
  peer.multiaddr.add(maWS)
  peer.multiaddr.add(maTCP)

  const node = new Relay()
  node.start(peer, (err) => {
    if (err) {
      return callback(err)
    }
    callback(null, node)
  })
}
