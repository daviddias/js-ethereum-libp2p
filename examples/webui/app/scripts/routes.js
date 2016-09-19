import React from 'react'
import {Route, IndexRoute, Redirect} from 'react-router'

import App from './containers/app'
import HomePage from './containers/home'
import NotFoundPage from './components/notfound'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={HomePage} />
    <Route path='home' component={HomePage} />

    <Route path='*' component={NotFoundPage} />
    <Redirect from='/index.html' to='/home' />
  </Route>
)
