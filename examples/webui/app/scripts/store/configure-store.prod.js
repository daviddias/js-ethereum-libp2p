import {createStore, applyMiddleware} from 'redux'
import {hashHistory} from 'react-router'
import {routerMiddleware} from 'react-router-redux'

import rootReducer from '../reducers'

const finalCreateStore = applyMiddleware(
  routerMiddleware(hashHistory)
)(createStore)

export default function configureStore (initialState) {
  const store = finalCreateStore(rootReducer, initialState)
  return store
}
