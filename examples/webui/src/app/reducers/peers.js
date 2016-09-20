import {peers as actions} from '../actions'
import multiaddr from 'multiaddr'

const defaultState = {
  list: []
}

function filter (list, peer) {
  return list.filter((p) => {
    return p.id.toB58String() !== peer.id.toB58String()
  })
}

export default function peers (state = defaultState, action) {
  const {type, peer} = action
  switch (type) {
    case actions.ADD_PEER:
      return {
        list: [
          ...filter(state.list, peer),
          peer
        ]
      }
    case actions.REMOVE_PEER:
      return {
        list: filter(state.list, peer)
      }
    default:
      return state
  }
}
