'use strict'
/* eslint-env mocha */

const ethereum = require('../src')
const expect = require('chai').expect
const Block = require('ethereumjs-block')
const async = require('async')

const thousand = require('./data/real-chain/first-1000-blocks.json')

describe('vm runs through the blockchain', function () {
  this.timeout(0)
  let eth

  it('spawn a ethereum node', () => {
    eth = new ethereum.Node()
  })

  it('add 3 blocks', (done) => {
    // skip the 1st block (genesis, vm generates it automatically)
    async.eachSeries(thousand.slice(1, 3), eachBlock, done)

    function eachBlock (raw, cb) {
      let block
      try {
        block = new Block(new Buffer(raw.slice(2), 'hex'))

        eth.blockchain.putBlock(block, (err) => {
          expect(err).to.not.exist
          cb()
        })
      } catch (err) { cb(err) }
    }
  })

  it('run through the blockchain', (done) => {
    eth.vm.runBlockchain((err) => {
      expect(err).to.not.exist
      eth.blockchain.getHead((err, block) => {
        expect(err).to.not.exist
        const currentHead = '0x' + eth.vm._blockchain.meta.rawHead.toString('hex')
        const expected = '0xb495a1d7e6663152ae92708da4843337b958146015a2802f4193a410044698c9'
        expect(currentHead).to.equal(expected)
        done()
      })
    })
  })
})

describe('checks if blocks are out of order', () => {
  let eth

  before(() => {
    eth = new ethereum.Node()
  })

  it('add first block', (done) => {
    const first = thousand[1]
    let block
    try {
      block = new Block(new Buffer(first.slice(2), 'hex'))
    } catch (err) {
      expect(err).to.not.exist
    }
    eth.blockchain.putBlock(block, (err) => {
      expect(err).to.not.exist
      eth.vm.runBlockchain(done)
    })
  })

  it('add fourth block (out of order)', (done) => {
    const fourth = thousand[4]
    let block
    try {
      block = new Block(new Buffer(fourth.slice(2), 'hex'))
    } catch (err) {
      expect(err).to.not.exist
    }

    // NOTE: putBlock checks if it has the parent
    eth.blockchain.putBlock(block, (err) => {
      expect(err).to.exist
      done()
    })
  })
})
