'use strict'
/* eslint-env mocha */

const ethereum = require('../src')
const expect = require('chai').expect
const Block = require('ethereumjs-block')
const BlockHeader = require('ethereumjs-block/header.js')
// const parallel = require('run-parallel')
const thousand = require('./data/real-chain/first-1000-blocks.json')
const async = require('async')
const utils = require('ethereumjs-util')
const rlp = utils.rlp

describe('process 1st 1000 blocks', () => {
  let eth

  it('spawn a node', () => {
    eth = new ethereum.Node()
  })

  it.skip('load pre data to setup vm', (done) => {
    // eth.vm.setup(testData, done)
  })

  it('add genesis block', (done) => {
    const decoded = rlp.decode(thousand[0])
    done()
    /*
    const genesisBlock = new Block()

    genesisBlock.header = new BlockHeader(
                            testData.genesisBlockHeader
                          )
    eth.vm._blockchain.putGenesis(genesisBlock, done)
    */
  })

  /*
  it.skip('add more blocks', (done) => {
    async.eachSeries(testData.blocks, eachBlock, done)

    function eachBlock (raw, cb) {
      let block
      try {
        block = new Block(new Buffer(raw.rlp.slice(2), 'hex'))

        // forces the block into thinking they are homestead
        block.header.isHomestead = () => { return true }
        block.uncleHeaders.forEach((uncle) => {
          uncle.isHomestead = () => { return true }
        })

        eth.vm._blockchain.putBlock(block, cb)
      } catch (err) { cb(err) }
    }
  })

  it.skip('run through the blockchain', (done) => {
    eth.vm.runBlockchain((err) => {
      expect(err).to.not.exist
      eth.vm.blockchain.getHead((err, block) => {
        expect(err).to.not.exist
        const currentHead = '0x' + eth.vm._blockchain.meta.rawHead.toString('hex')
        const expected = testData.lastblockhash
        expect(currentHead).to.equal(expected)
        done()
      })
    })
  })
  */
})
