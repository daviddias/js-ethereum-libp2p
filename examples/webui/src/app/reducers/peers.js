import {peers as actions} from '../actions'
import multiaddr from 'multiaddr'

const defaultState = {
  list: [
    multiaddr('/ip4/46.5.20.17/tcp/4001/ipfs/QmVqkWPYn5WSgETUdviL63uR62sRT7ZKQHAohanttCgQ5C'),
    multiaddr('/ip4/127.5.20.17/tcp/4001/ipfs/QmVqkWPYn5WSgETUdviL63uR62sRT7ZKQHAohanttCgQ5C')
  ]
}

export default function peers (state = defaultState, action) {
  const {type, peer} = action
  switch (type) {
    case actions.ADD_PEER:
      console.log('add', peer)
      return state
    case actions.REMOVE_PEER:
      console.log('remove', peer)
      return state
    default:
      return state
  }
}
