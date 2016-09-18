'use strict'
/* eslint-env mocha */

const ethereum = require('../src')
const expect = require('chai').expect
const Block = require('ethereumjs-block')
// const BlockHeader = require('ethereumjs-block/header.js')
// const parallel = require('run-parallel')
const async = require('async')
// const utils = require('ethereumjs-util')
// const rlp = utils.rlp

const thousand = require('./data/real-chain/first-1000-blocks.json')

describe('process 1st 1000 blocks', function () {
  this.timeout(0)
  let eth

  it('spawn a ethereum node', () => {
    eth = new ethereum.Node()
  })

  it('add 1000 blocks', (done) => {
    async.eachSeries(thousand.slice(1), eachBlock, done)

    function eachBlock (raw, cb) {
      let block
      try {
        block = new Block(new Buffer(raw.slice(2), 'hex'))

        eth.vm._blockchain.putBlock(block, (err) => {
          expect(err).to.not.exist
          cb()
        })
      } catch (err) { cb(err) }
    }
  })

  it('run through the blockchain', (done) => {
    eth.vm.runBlockchain((err) => {
      expect(err).to.not.exist
      eth.vm.blockchain.getHead((err, block) => {
        expect(err).to.not.exist
        const currentHead = '0x' + eth.vm._blockchain.meta.rawHead.toString('hex')
        const expected = '0xc31b362e591aa07faa977dbc492ae43cd47eef291920435153bbbf3acaf2fc2f'
        expect(currentHead).to.equal(expected)
        done()
      })
    })
  })
})

/*
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
*/
