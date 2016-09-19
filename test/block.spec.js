'use strict'
/* eslint-env mocha */

const ethereum = require('../src')
const expect = require('chai').expect
const parallel = require('run-parallel')
const Block = require('ethereumjs-block')
const thousand = require('./data/real-chain/first-1000-blocks.json')
const async = require('async')

describe('block', () => {
  let eth1
  let eth2

  before((done) => {
    eth1 = new ethereum.Node()
    eth2 = new ethereum.Node()

    parallel([
      eth1.start,
      eth2.start
    ], done)
  })

  after((done) => {
    parallel([
      eth1.stop,
      eth2.stop
    ], done)
  })

  it('connect both nodes', (done) => {
    // in the browser this will be idempotent due to wstar discovery
    eth1.libp2p.dialByPeerInfo(eth2.libp2p.peerInfo, done)
  })

  it('run through blockchain in first node', (done) => {
    async.eachSeries(thousand.slice(1, 3), eachBlock, next)

    function eachBlock (raw, cb) {
      let block
      try {
        block = new Block(new Buffer(raw.slice(2), 'hex'))

        eth1.blockchain.putBlock(block, (err) => {
          expect(err).to.not.exist
          cb()
        })
      } catch (err) { cb(err) }
    }

    function next (err) {
      expect(err).to.not.exist
      eth1.vm.runBlockchain(done)
    }
  })

  it.skip('block.sync', (done) => {})

  it.skip('run through blockchain in the second', (done) => {})
})
