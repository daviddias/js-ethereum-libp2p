import * as blocks from './blocks'
import * as accounts from './accounts'
import * as peers from './peers'

export function start () {
  return (dispatch, getState, getNode) => {
    return getNode.then((node) => {
      let current
      node.vm.on('beforeBlock', (block, cb) => {
        current = block
        dispatch(blocks.addBefore(block))
        dispatch(accounts.before(node, block.header.coinbase))
        cb()
      })

      node.vm.on('afterBlock', (res, cb) => {
        dispatch(blocks.addAfter(current))
        dispatch(accounts.after(node, current.header.coinbase))
        cb()
      })

      node.libp2p.swarm.on('peer-mux-established', (peer) => {
        dispatch(peers.add(peer))
      })

      node.libp2p.swarm.on('peer-mux-closed', (peer) => {
        dispatch(peers.remove(peer))
      })
    })
  }
}

export function stop () {
  return (dispatch, getState, getNode) => {
    return getNode.then((node) => {
      node.stop()
    })
  }
}
