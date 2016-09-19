js-ethereum-libp2p
==================

![](https://github.com/diasdavid/js-ethereum-libp2p/blob/master/img/banner.png?raw=true)

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io)
[![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)
[![](https://img.shields.io/badge/freenode-%23ethereumjs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ethereumjs)
[![Coverage Status](https://coveralls.io/repos/github/diasdavid/js-ethereum-libp2p/badge.svg?branch=master)](https://coveralls.io/github/diasdavid/js-ethereum-libp2p?branch=master)
[![Travis CI](https://travis-ci.org/diasdavid/js-ethereum-libp2p.svg?branch=master)](https://travis-ci.org/diasdavid/js-ethereum-libp2p)
[![Circle CI](https://circleci.com/gh/diasdavid/js-ethereum-libp2p.svg?style=svg)](https://circleci.com/gh/diasdavid/js-ethereum-libp2p)
[![Dependency Status](https://david-dm.org/diasdavid/js-ethereum-libp2p.svg?style=flat-square)](https://david-dm.org/diasdavid/js-ethereum-libp2p)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

> Get the ethereum blockchain in the Browser or in a Node.js process using libp2p and run through it using ethereum-vm. This is the humble starts of getting a full ethereum node running in JavaScript that can interact with the rest of the network.

# BEWARE BEWARE BEWARE

This module is a work in progress! So beware of dragons! 🐲 🐉

# Description

# Example

# Usage

## Install

## API

### Ethereum Node Class: `Ethereum.Node`

#### Create an Ethereum Node: `const eth = new Ethereum.Node()`

#### Start the node: `eth.start([PeerInfo], callback)`

#### Stop the node: `eth.stop(callback)`

### libp2p: `eth.libp2p`

See [ipfs/js-libp2p-ipfs](https://github.com/ipfs/js-libp2p-ipfs) for documentation.

### BlockChain: `eth.blockchain`

#### Synchronize (fetch) the latest state of the blockchain `eth.blockchain.sync([PeerInfo], callback)`

> Synchronizes the BlockChain, fetching every block in the network.

### Virtual Machine `eth.vm`

Instance of [ethereumjs-vm](https://www.npmjs.com/package/ethereumjs-vm), see [ethereumjs/ethereumjs-vm](https://github.com/ethereumjs/ethereumjs-vm) for docs.

### Blocks

> WIP

### Send a block

### Broadcast a block

### Transactions

> WIP

### Send a transaction

### Broadcast a transaction

## License

MIT © David Dias
