'use strict'

const MPTrie = require('merkle-patricia-tree/secure')
const Blockchain = require('ethereumjs-blockchain')
const VM = require('ethereumjs-vm')
const LevelUp = require('levelup')

exports = module.exports

/*
 * Creates an ethereum-vm attached to a StateTrie and
 * a blockchain instance
 */
exports.create = (blockchain) => {
  if (!blockchain) {
    const rnd = Math.floor(Math.random() * 1000).toString()
    const db = require('memdown')
    const blockchainDB = new LevelUp('./bc' + rnd, { db: db })
    blockchain = new Blockchain(blockchainDB)
    blockchain.ethash.cacheDB = new LevelUp('./bc-cache' + rnd, { db: db })
  }

  const stateTrie = new MPTrie()
  const vm = new VM({
    state: stateTrie,
    blockchain: blockchain
  })

  // NOTE: it would be super cool if the object get exposed
  // by default, however, it only exposes a version with a
  // getBlock fun
  vm._blockchain = blockchain

  return vm
}
