import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import errors from './errors'
import blocks from './blocks'
import transactions from './transactions'
import peers from './peers'
import accounts from './accounts'

const rootReducer = combineReducers({
  blocks,
  transactions,
  peers,
  accounts,
  errors,
  routing: routerReducer
})

export default rootReducer
