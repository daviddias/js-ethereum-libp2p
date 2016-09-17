'use strict'
/* eslint-env mocha */

const ethereum = require('../src')
const expect = require('chai').expect
const Block = require('ethereumjs-block')
const BlockHeader = require('ethereumjs-block/header.js')

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

  // TODO pass all of these tests to the real chain test
  // the example chain only has one block
  describe.skip('check vm state when blocks are passed out of order', () => {
    let eth

    before((done) => {
      eth = new ethereum.Node()
      eth.vm.setup(states.pre, (err) => {
        expect(err).to.not.exist
        const genesisBlock = new Block()
        genesisBlock.header = new BlockHeader(genesis.header)
        eth.vm._blockchain.putGenesis(genesisBlock, done)
      })
    })

    it('add first block', (done) => {
      const first = blocks[0]
      let block
      try {
        block = new Block(new Buffer(first.rlp.slice(2), 'hex'))
      } catch (err) {
        expect(err).to.not.exist
      }
      monkeyPatchBlock(block)
      eth.vm._blockchain.putBlock(block, (err) => {
        expect(err).to.not.exist
        eth.vm.runBlockchain(done)
      })
    })

    it('add second block', (done) => {
      const second = blocks[1]
      let block
      try {
        block = new Block(new Buffer(second.rlp.slice(2), 'hex'))
      } catch (err) {
        expect(err).to.not.exist
      }
      monkeyPatchBlock(block)
      eth.vm._blockchain.putBlock(block, (err) => {
        expect(err).to.not.exist
        eth.vm.runBlockchain(done)
      })
    })

    it('add fourth block (out of order)', (done) => {
      const fourth = blocks[3]
      let block
      try {
        block = new Block(new Buffer(fourth.rlp.slice(2), 'hex'))
      } catch (err) {
        expect(err).to.not.exist
      }
      monkeyPatchBlock(block)
      eth.vm._blockchain.putBlock(block, (err) => {
        expect(err).to.not.exist
        eth.vm.runBlockchain((err) => {
          expect(err).to.exist
          done()
        })
      })
    })
  })

  describe.skip('transfer blocks to a newly joined node', () => {
    // TODO
    //   before: create 2 nodes, run the blockchain in one
    //   connect 1
    //   connect the second, see the blocks coming
  })

  describe.skip('transfer blocks to the rest of the network as they appear', () => {
    // TODO
    //   before: create 2 nodes, connect them
    //   add first block
    //   add remaining blocks
    before(() => {})
    after(() => {})
  })
})

function monkeyPatchBlock (block) {
  // forces the block into thinking they are homestead
  block.header.isHomestead = () => { return true }
  block.uncleHeaders.forEach((uncle) => {
    uncle.isHomestead = () => { return true }
  })
}
