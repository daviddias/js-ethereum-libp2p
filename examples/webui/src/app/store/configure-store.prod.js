import {createStore, applyMiddleware} from 'redux'
import {hashHistory} from 'react-router'
import {routerMiddleware} from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'

import rootReducer from '../reducers'
import {api} from '../services'

const finalCreateStore = applyMiddleware(
  thunkMiddleware.withExtraArgument(api.createNode()),
  routerMiddleware(hashHistory)
)(createStore)

export default function configureStore (initialState) {
  const store = finalCreateStore(rootReducer, initialState)
  return store
}
