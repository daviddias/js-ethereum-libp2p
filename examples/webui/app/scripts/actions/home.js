import ethereum from '../../../../../src'
import * as blocks from './blocks'
import * as accounts from './accounts'
import * as peers from './peers'
let node

function startNode () {
  const _node = new ethereum.Node()

  return new Promise((resolve, reject) => {
    _node.start((err) => {
      if (err) {
        return reject(err)
      }

      resolve(_node)
    })
  })
}

export function start () {
  return (dispatch, getState) => {
    // TODO: fix me
    // this throws "checkpoint is not defined"
    //
    // return startNode().then((_node) => {
    //   node = _node

    //   node.vm.on('beforeBlock', (block, cb) => {
    //     dispatch(blocks.addBefore(block))
    //     dispatch(accounts.before(node, block.header.coinbase))
    //     cb()
    //   })

    //   node.vm.on('afterBlock', (block, cb) => {
    //     dispatch(blocks.addAfter(block))
    //     dispatch(accounts.after(node, block.header.coinbase))
    //     cb()
    //   })

    //   // TODO: connect to peer-connected and peer-disconnected
    //   const onPeerConnected = (peer) => {
    //     dispatch(peers.add(peer))
    //   }
    //   const onPeerDisconnected = (peer) => {
    //     dispatch(peers.remove(peer))
    //   }
    // })
    return Promise.resolve()
  }
}

export function stop () {
  node.stop()

  return Promise.resolve()
}
