import Block from 'ethereumjs-block'
import blocks from '../../../../../test/data/real-chain/first-1000-blocks.json'
import PeerId from 'peer-id'
import PeerInfo from 'peer-info'
import multiaddr from 'multiaddr'
import relayPeerIdJson from '../../../../../test/data/relay-peer.json'

const limitedBlocks = blocks.slice(1, 6)

export const SET_CURRENT_HEAD = 'SET_CURRENT_HEAD'
export const START = 'START_PROCESSING'
export const STOP = 'STOP_PROCESSING'

export function start (prop) {
  return {
    type: START,
    prop: prop
  }
}

export function stop (prop) {
  return {
    type: STOP,
    prop: prop
  }
}

export function setCurrentHead (head) {
  return {
    type: SET_CURRENT_HEAD,
    head: head
  }
}

export function simulate () {
  return (dispatch, getState, getNode) => {
    dispatch(start('simulate'))
    return getNode.then((node) => {
      return Promise.all(limitedBlocks.map((raw) => {
        const block = new Block(new Buffer(raw.slice(2), 'hex'))
        return putBlock(node, block)
      }))
      .then(() => runBlockchain(node))
      .then(() => getHead(node))
      .then(() => updateHead(dispatch, node))
      .then(() => dispatch(stop('simulate')))
    })
  }
}

export function sync () {
  return (dispatch, getState, getNode) => {
    dispatch(start('sync'))
    return getNode.then((node) => {
      return callSync(node)
      .then(() => runBlockchain(node))
      .then(() => getHead(node))
      .then(() => updateHead(dispatch, node))
      .then(() => dispatch(stop('sync')))
    })
  }
}

export function star () {
  return (dispatch, getState, getNode) => {
    dispatch(start('star'))

    return getNode.then((node) => {
      pullBlockchain(dispatch, node)

      return callSync(node, relayInfo())
        .then(() => dispatch(stop('star')))
    })
  }
}

function updateHead (dispatch, node) {
  const head = '0x' + node.vm._blockchain.meta.rawHead.toString('hex')
  dispatch(setCurrentHead(head))
}

function runBlockchain (node) {
  return new Promise((resolve, reject) => {
    node.vm.runBlockchain((err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function getHead (node) {
  return new Promise((resolve, reject) => {
    node.vm.blockchain.getHead((err, block) => {
      if (err) return reject(err)
      resolve(block)
    })
  })
}

function callSync (node, info) {
  return new Promise((resolve, reject) => {
    node.block.sync(info, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function putBlock (node, block) {
  return new Promise((resolve, reject) => {
    node.vm._blockchain.putBlock(block, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function relayInfo () {
  const relayId = PeerId.createFromJSON(relayPeerIdJson)
  const relayma = multiaddr('/ip4/127.0.0.1/tcp/33333/ws')
  const relayInfo = new PeerInfo(relayId)
  relayInfo.multiaddr.add(relayma)

  return relayInfo
}

function pullBlockchain (dispatch, node) {
  let running
  setTimeout(() => {
    setInterval(() => {
      if (running) return
      running = true

      runBlockchain(node).then(() => {
        running = false
        updateHead(dispatch, node)
      })
    }, 2000)
  }, 2000)
}
