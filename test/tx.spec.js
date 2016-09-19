'use strict'
/* eslint-env mocha */

const eth = require('../src')
const expect = require('chai').expect
const parallel = require('run-parallel')
const Transaction = require('ethereumjs-tx')
const Peer = require('peer-info')
const Id = require('peer-id')
const multiaddr = require('multiaddr')

describe('tx', () => {
  let eth1
  let eth2
  let relayInfo

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

  it('send a tx', (done) => {
    const pk = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')

    eth1.setPrivateKey(pk)

    const tx = new Transaction()
    tx.nonce = 0
    tx.gasPrice = 100
    tx.gasLimit = 1000
    tx.value = 0
    tx.data = '0x7f4e616d65526567000000000000000000000000000000000000000000000000003057307f4e616d6552656700000000000000000000000000000000000000000000000000573360455760415160566000396000f20036602259604556330e0f600f5933ff33560f601e5960003356576000335700604158600035560f602b590033560f60365960003356573360003557600035335700'

    eth2.once('tx', (tx) => {
      expect(tx).to.exist
      done()
    })

    eth1.tx.send(eth2.libp2p.peerInfo, tx, (err) => {
      expect(err).to.not.exist
    })
  })

  it('connect to tx-relay', (done) => {
    const relayPeerIdJson = require('./data/relay-peer.json')
    const id = Id.createFromJSON(relayPeerIdJson)
    const mh = multiaddr('/ip4/127.0.0.1/tcp/33333/ws')
    relayInfo = new Peer(id)
    relayInfo.multiaddr.add(mh)

    parallel([
      (cb) => { eth1.libp2p.dialByPeerInfo(relayInfo, cb) },
      (cb) => { eth2.libp2p.dialByPeerInfo(relayInfo, cb) }
    ], done)
  })

  it('send tx to tx-relay', (done) => {
    const tx = new Transaction()
    tx.nonce = 0
    tx.gasPrice = 100
    tx.gasLimit = 1000
    tx.value = 0
    tx.data = '0x7f4e616d65526567000000000000000000000000000000000000000000000000003057307f4e616d6552656700000000000000000000000000000000000000000000000000573360455760415160566000396000f20036602259604556330e0f600f5933ff33560f601e5960003356576000335700604158600035560f602b590033560f60365960003356573360003557600035335700'

    eth1.tx.relay(relayInfo, tx, done)
  })

  it('stop the nodes', (done) => {
    parallel([
      eth1.stop,
      eth2.stop
    ], () => {
      setTimeout(done, 1000)
    })
  })
})
