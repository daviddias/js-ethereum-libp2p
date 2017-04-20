const Account = require('ethereumjs-account')

export const ADD_OR_UPDATE_ACCOUNT = 'ADD_OR_UPDATE_ACCOUNT'

export function received (coinbase, account) {
  return {
    type: ADD_OR_UPDATE_ACCOUNT,
    id: coinbase,
    account: account,
    status: 'received'
  }
}

export function processed (coinbase, account) {
  return {
    type: ADD_OR_UPDATE_ACCOUNT,
    id: coinbase,
    account: account,
    status: 'processed'
  }
}

export function before (node, coinbase) {
  return (dispatch) => {
    node.vm.trie.get(coinbase, (err, account) => {
      if (err) {
        return console.error(err)
      }
      dispatch(received(coinbase, new Account(account)))
    })
  }
}

export function after (node, coinbase) {
  return (dispatch) => {
    node.vm.trie.get(coinbase, (err, account) => {
      if (err) {
        return console.error(err)
      }
      dispatch(processed(new Account(coinbase, account)))
    })
  }
}
