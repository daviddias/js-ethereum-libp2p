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
  let eth

  it('spawn a node', () => {
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

        // forces the block into thinking they are homestead
        block.header.isHomestead = () => { return true }
        block.uncleHeaders.forEach((uncle) => {
          uncle.isHomestead = () => { return true }
        })

        eth.vm._blockchain.putBlock(block, cb)
      } catch (err) { cb(err) }
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
