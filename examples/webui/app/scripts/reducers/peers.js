const multiaddr = require('multiaddr')

const defaultState = {
  list: [
    multiaddr('/ip4/46.5.20.17/tcp/4001/ipfs/QmVqkWPYn5WSgETUdviL63uR62sRT7ZKQHAohanttCgQ5C')
  ]
}

export default function peers (state = defaultState, action) {
  return state
}
