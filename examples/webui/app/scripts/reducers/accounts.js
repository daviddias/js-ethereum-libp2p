import {accounts as actions} from '../actions'

const defaultState = {
  list: {
    cool: {
      account: {
        hash: 'hello',
        balance: 532
      },
      status: 'received'
    },
    crazycool: {
      account: {
        hash: 'world',
        balance: 12532
      },
      status: 'processed'
    }
  }
}

export default function accounts (state = defaultState, action) {
  const {id, account, status, type} = action
  switch (type) {
    case actions.ADD_OR_UPDATE_ACCOUNT:
      return {
        list: {
          ...state.list,
          [id]: {account, status}
        }
      }
    default:
      return state
  }
}
