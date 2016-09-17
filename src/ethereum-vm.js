'use strict'

const MPTrie = require('merkle-patricia-tree/secure')
const Blockchain = require('ethereumjs-blockchain')
const VM = require('ethereumjs-vm')
const LevelUp = require('levelup')
const isNode = require('detect-node')
const Account = require('ethereumjs-account')
const async = require('async')
const utils = require('ethereumjs-util')
const rlp = utils.rlp
const BN = utils.BN

exports = module.exports

/*
 * Creates an ethereum-vm attached to a StateTrie and
 * a blockchain instance
 */
exports.create = () => {
  const db = isNode ? require('memdown') : require('level-js')
  const blockchainDB = new LevelUp('bc', { db: db })
  const blockchain = new Blockchain(blockchainDB)

  blockchain.ethash.cacheDB = new LevelUp('bc-cache', { db: db })

  const stateTrie = new MPTrie()
  const vm = new VM({ state: stateTrie, blockchain: blockchain })

  // NOTE: it would be super cool if the object get exposed
  // by default, however, it only exposes a version with a
  // getBlock fun
  vm._blockchain = blockchain

  // caveat for pre-homestead tx
  vm.on('beforeTx', (tx) => { tx._homestead = true })

  // caveat for pre-homestead block
  vm.on('beforeBlock', (block) => {
    block.header.isHomestead = () => { return true }
  })

  // setUpPreConditions
  vm.setup = (preState, callback) => {
    const keysOfPre = Object.keys(preState)

    async.eachSeries(keysOfPre, (key, cb1) => {
      var acctData = preState[key]
      var account = new Account()

      account.nonce = format(acctData.nonce)
      account.balance = format(acctData.balance)

      var codeBuf = new Buffer(acctData.code.slice(2), 'hex')
      var storageTrie = stateTrie.copy()
      storageTrie.root = null

      async.series([
        (cb2) => {
          const keys = Object.keys(acctData.storage)

          async.forEachSeries(keys, function (key, cb3) {
            let val = acctData.storage[key]
            val = rlp.encode(new Buffer(val.slice(2), 'hex'))
            key = utils.setLength(new Buffer(key.slice(2), 'hex'), 32)

            storageTrie.put(key, val, cb3)
          }, cb2)
        },
        (cb2) => {
          account.setCode(stateTrie, codeBuf, cb2)
        },
        (cb2) => {
          account.stateRoot = storageTrie.root

          stateTrie.put(new Buffer(key, 'hex'),
              account.serialize(), cb2)
        }
      ], cb1)
    }, callback)
  }

  return vm
}

function format (a, toZero, isHex) {
  if (a === '') {
    return new Buffer([])
  }

  if (a.slice && a.slice(0, 2) === '0x') {
    a = a.slice(2)
    if (a.length % 2) a = '0' + a
    a = new Buffer(a, 'hex')
  } else if (!isHex) {
    a = new Buffer(new BN(a).toArray())
  } else {
    if (a.length % 2) a = '0' + a
    a = new Buffer(a, 'hex')
  }

  if (toZero && a.toString('hex') === '') {
    a = new Buffer([0])
  }

  return a
}
