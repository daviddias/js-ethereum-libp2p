import {createStore, applyMiddleware} from 'redux'
import {hashHistory} from 'react-router'
import {routerMiddleware} from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'

import rootReducer from '../reducers'

const finalCreateStore = applyMiddleware(
  thunkMiddleware,
  routerMiddleware(hashHistory)
)(createStore)

export default function configureStore (initialState) {
  const store = finalCreateStore(rootReducer, initialState)
  return store
}
