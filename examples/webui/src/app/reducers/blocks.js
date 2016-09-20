import {blocks as actions} from '../actions'

const defaultState = {
  list: {
  }
}

export default function blocks (state = defaultState, action) {
  const {type, status, block} = action
  switch (type) {
    case actions.ADD_BLOCK:
      return {
        list: {
          ...state.list,
          [block.header.number.toString('hex')]: {
            status,
            block
          }
        }
      }
    default:
      return state
  }
}
