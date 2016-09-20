import {buttons as actions} from '../actions'

const defaultState = {
  simulate: false,
  sync: false,
  star: false
}

export default function processing (state = defaultState, action) {
  const {type, prop} = action

  switch (type) {
    case actions.START:
      return {
        ...state,
        [prop]: true
      }
    case actions.STOP:
      return {
        ...state,
        [prop]: false
      }
    default:
      return state
  }
}
