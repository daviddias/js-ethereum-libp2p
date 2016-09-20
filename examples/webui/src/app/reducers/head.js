import {buttons as actions} from '../actions'

const defaultState = null

export default function errors (state = defaultState, action) {
  const {type, head} = action

  if (type === actions.SET_CURRENT_HEAD) {
    return head
  } else {
    return state
  }
}
