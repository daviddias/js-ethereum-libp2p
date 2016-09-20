import {createStore, applyMiddleware, compose} from 'redux'
import {hashHistory} from 'react-router'
import {routerMiddleware} from 'react-router-redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import rootReducer from '../reducers'
import {api} from '../services'

const finalCreateStore = compose(
  applyMiddleware(
    thunkMiddleware.withExtraArgument(api.createNode()),
    routerMiddleware(hashHistory),
    createLogger()
  ),
  window.devToolsExtension ? window.devToolsExtension() : (f) => f
)(createStore)

export default function configureStore (initialState) {
  const store = finalCreateStore(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
