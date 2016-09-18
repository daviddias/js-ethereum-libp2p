'use strict'
/* eslint-env mocha */

const ethereum = require('../src')
const expect = require('chai').expect
const Block = require('ethereumjs-block')
const BlockHeader = require('ethereumjs-block/header.js')
const parallel = require('run-parallel')

const async = require('async')

// test data
const blocks = require('./data/example-chain/blocks.json')
const genesis = require('./data/example-chain/genesis-block.json')
const states = require('./data/example-chain/states.json')

describe('ethereum-vm', () => {
  describe('run through a simulated chain', () => {
    let eth

    before(() => {
      eth = new ethereum.Node()
    })

    it('load pre data to setup vm', (done) => {
      eth.vm.setup(states.pre, done)
    })

    it('add genesis block', (done) => {
      const genesisBlock = new Block()
      genesisBlock.header = new BlockHeader(genesis.header)
      eth.vm._blockchain.putGenesis(genesisBlock, done)
    })

    it('add more blocks', (done) => {
      async.eachSeries(blocks, eachBlock, done)

      function eachBlock (raw, cb) {
        let block
        try {
          block = new Block(new Buffer(raw.rlp.slice(2), 'hex'))
        } catch (err) {
          return cb(err)
        }
        monkeyPatchBlock(block)
        eth.vm._blockchain.putBlock(block, cb)
      }
    })

    it('run through the blockchain', (done) => {
      eth.vm.runBlockchain((err) => {
        expect(err).to.not.exist
        eth.vm.blockchain.getHead((err, block) => {
          expect(err).to.not.exist
          const currentHead = '0x' + eth.vm._blockchain.meta.rawHead.toString('hex')
          expect(currentHead).to.equal(states.lastBlockHash)
          done()
        })
      })
    })
  })

  describe('transfer blocks to a newly joined node', () => {
    // TODO
    //   before: create 2 nodes, run the blockchain in one
    //   connect 1
    //   connect the second, see the blocks coming

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

    it('set up genesis in both', (done) => {
      const genesisBlock = new Block()
      genesisBlock.header = new BlockHeader(genesis.header)

      parallel([
        (cb) => {
          eth1.vm._blockchain.putGenesis(genesisBlock, cb)
        },
        (cb) => {
          eth2.vm._blockchain.putGenesis(genesisBlock, cb)
        }], done)
    })

    it('run the blockchain on the first node', (done) => {
      async.eachSeries(blocks, eachBlock, run)

      function eachBlock (raw, cb) {
        let block
        try {
          block = new Block(new Buffer(raw.rlp.slice(2), 'hex'))
        } catch (err) {
          return cb(err)
        }
        monkeyPatchBlock(block)
        eth1.vm._blockchain.putBlock(block, cb)
      }

      function run () {
        eth1.vm.runBlockchain(done)
      }
    })

    it('connect the second node, check that blocks come in', (done) => {
      eth1.libp2p.dialByPeerInfo(eth2.libp2p.peerInfo, done)
    })
  })

  describe.skip('transfer blocks to the rest of the network as they appear', () => {
    // TODO
    //   before: create 2 nodes, connect them
    //   add first block
    //   add remaining blocks

    // let eth1
    // let eth2

    before((done) => {
    })

    after((done) => {})
  })
})

function monkeyPatchBlock (block) {
  // forces the block into thinking they are homestead
  block.header.isHomestead = () => { return true }
  block.uncleHeaders.forEach((uncle) => {
    uncle.isHomestead = () => { return true }
  })
}
