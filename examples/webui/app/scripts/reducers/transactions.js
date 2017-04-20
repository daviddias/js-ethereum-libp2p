const defaultState = {
  list: {
    'hello': {
      tx: {},
      status: 'processed'
    },
    'world': {
      tx: {},
      status: 'received'
    }
  }
}

export default function transactions (state = defaultState, action) {
  return state
}
