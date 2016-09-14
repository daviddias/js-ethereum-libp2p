'use strict'

const gulp = require('gulp')
const multiaddr = require('multiaddr')
const signalling = require('libp2p-webrtc-star/src/signalling-server')
const Peer = require('peer-info')
const Id = require('peer-id')
const parallel = require('run-parallel')
const Relay = require('./src').Relay

let sig
let relayNode

gulp.task('libnode:start', (done) => {
  spawnNode((err, node) => {
    if (err) {
      throw err
    }
    relayNode = node
    sig = signalling.start(20000, done)
  })
})

gulp.task('libnode:stop', (done) => {
  setTimeout(waitAndClose, 1000)
  function waitAndClose () {
    parallel([
      (cb) => {
        relayNode.stop(cb)
      },
      (cb) => {
        sig.stop(cb)
      }
    ], done)
  }
})

gulp.task('test:browser:before', ['libnode:start'])
gulp.task('test:node:before', ['libnode:start'])
gulp.task('test:browser:after', ['libnode:stop'])
gulp.task('test:node:after', ['libnode:stop'])

require('aegir/gulp')(gulp)

function spawnNode (callback) {
  const relayPeerIdJson = require('./test/data/relay-peer.json')
  const id = Id.createFromJSON(relayPeerIdJson)
  const mh = multiaddr('/ip4/127.0.0.1/tcp/33333/ws')

  const peer = new Peer(id)
  peer.multiaddr.add(mh)

  const node = new Relay()
  node.start(peer, (err) => {
    if (err) {
      return callback(err)
    }
    callback(null, node)
  })

  node.on('tx', (tx) => {
    console.log('🌟 received transaction for relay 🎉')
  })
}
