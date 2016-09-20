import {blocks as actions} from '../actions'
import {bufferToInt} from 'ethereumjs-util'

const defaultState = {
  list: []
}

export default function blocks (state = defaultState, action) {
  const {type, status, block} = action
  switch (type) {
    case actions.ADD_BLOCK:
      const i = findIndex(state.list, block)
      if (i === -1) {
        return {
          list: [
            ...state.list,
            {status, block}
          ].sort(sorter)
        }
      }

      return {
        list: [
          ...state.list.slice(0, i),
          {status, block},
          ...state.list.slice(i + 1)
        ].sort(sorter)
      }
    default:
      return state
  }
}

function findIndex (list, block) {
  const n = getNumber(block)
  console.log('block', n, block.header.number.toString('hex'))
  return list.findIndex((a) => getNumber(a.block) === n)
}

function sorter (a, b) {
  const an = getNumber(a.block)
  const bn = getNumber(b.block)

  if (an < bn) return 1
  if (an > bn) return -1
  return 0
}

function getNumber (block) {
  return bufferToInt(block.header.number)
}
