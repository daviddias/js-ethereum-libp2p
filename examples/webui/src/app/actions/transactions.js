export const ADD_OR_UPDATE_TRANSACTION = 'ADD_OR_UPDATE_TRANSACTION'

export function add (tx) {
  return {
    type: ADD_OR_UPDATE_TRANSACTION,
    tx: tx,
    status: 'received'
  }
}

export function processed (tx) {
  return {
    type: ADD_OR_UPDATE_TRANSACTION,
    tx: tx,
    status: 'processed'
  }
}
