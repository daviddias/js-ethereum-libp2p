export const ADD_PEER = 'ADD_PEER'
export const REMOVE_PEER = 'REMOVE_PEER'

export function add (peer) {
  return {
    type: ADD_PEER,
    peer: peer
  }
}

export function remove (peer) {
  return {
    type: REMOVE_PEER,
    peer: peer
  }
}
