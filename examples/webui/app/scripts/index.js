import 'babel-polyfill'

import React from 'react'
import {render} from 'react-dom'
import {hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import routes from './routes'
import Root from './containers/root'
import configureStore from './store/configure-store'
import 'react-virtualized/styles.css'
import '../styles/app.less'

const store = configureStore()
const history = syncHistoryWithStore(hashHistory, store)

injectTapEventPlugin()

requestAnimationFrame(() => {
  render(
    <Root
      store={store}
      history={history}
      routes={routes}
    />,
    document.getElementById('root')
  )
})
