'use strict'

const gulp = require('gulp')
const multiaddr = require('multiaddr')
const Node = require('libp2p-ipfs').Node
const Peer = require('peer-info')
const Id = require('peer-id')
const pull = require('pull-stream')
const signalling = require('libp2p-webrtc-star/src/signalling-server')
const parallel = require('run-parallel')

let sig
let runningNode

gulp.task('libnode:start', (done) => {
  spawnNode((err, node) => {
    if (err) {
      throw err
    }
    runningNode = node
    sig = signalling.start(20000, done)
  })
})

gulp.task('libnode:stop', (done) => {
  setTimeout(waitAndClose, 1000)
  function waitAndClose () {
    parallel([
      (cb) => {
        runningNode.stop(cb)
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
  const gulpPeer = require('./test/data/gulp-peer.json')
  const id = Id.createFromJSON(gulpPeer)

  const mh = multiaddr('/ip4/127.0.0.1/tcp/9200/ws')

  const peer = new Peer(id)
  peer.multiaddr.add(mh)

  const node = new Node(peer)
  node.start(onStart)

  function onStart (err) {
    if (err) {
      callback(err)
    }

    // handle the protos
    node.handle('/echo/1.0.0', (conn) => {
      pull(
        conn,
        conn
      )
    })

    callback(null, node)
  }
}
