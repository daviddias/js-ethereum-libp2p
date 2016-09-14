'use strict'
/* eslint-env mocha */

const eth = require('../src')
const expect = require('chai').expect
const parallel = require('run-parallel')

describe('ethereum-libp2p', () => {
  let eth1
  let eth2

  it('spawn 2 nodes', (done) => {
    eth1 = new eth.Node()
    eth2 = new eth.Node()

    parallel([
      eth1.start,
      eth2.start
    ], done)
  })

  it('connect both nodes', (done) => {
    eth1.libp2p.dialByPeerInfo(eth2.libp2p.peerInfo, done)
  })

  it.skip('send a tx', (done) => {})
  it.skip('connect to tx-relay', (done) => {})
  it.skip('send tx to tx-relay', (done) => {})
})
