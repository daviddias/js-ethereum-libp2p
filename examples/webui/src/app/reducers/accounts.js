import {accounts as actions} from '../actions'
import {bufferToInt} from 'ethereumjs-util'

const defaultState = {
  list: []
}

export default function accounts (state = defaultState, action) {
  const {id, account, status, type} = action
  switch (type) {
    case actions.ADD_OR_UPDATE_ACCOUNT:
      const i = findIndex(state.list, id)
      if (i === -1) {
        return {
          list: [
            ...state.list,
            {account, status, id}
          ].sort(sorter)
        }
      }

      return {
        list: [
          ...state.list.slice(0, i),
          {account, status, id},
          ...state.list.slice(i + 1)
        ].sort(sorter)
      }
    default:
      return state
  }
}

function findIndex (list, id) {
  const n = getNumber(id)
  return list.findIndex((a) => getNumber(a.id) === n)
}

function sorter (a, b) {
  const an = getNumber(a.id)
  const bn = getNumber(b.id)

  if (an < bn) return 1
  if (an > bn) return -1
  return 0
}

function getNumber (id) {
  return bufferToInt(id)
}
