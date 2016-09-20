import {accounts as actions} from '../actions'

const defaultState = {
  list: {
  }
}

export default function accounts (state = defaultState, action) {
  const {id, account, status, type} = action
  switch (type) {
    case actions.ADD_OR_UPDATE_ACCOUNT:
      return {
        list: {
          ...state.list,
          [id.toString('hex')]: {account, status, id}
        }
      }
    default:
      return state
  }
}
