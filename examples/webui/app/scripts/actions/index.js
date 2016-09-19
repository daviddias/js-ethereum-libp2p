// Broken because of https://phabricator.babeljs.io/T2877
// export * from './pages'
// export * from './errors'

// export * from './home'

// Workaround

import * as pages from './pages'
import * as errors from './errors'
import * as router from './router'

import * as home from './home'

export {pages}
export {errors}
export {router}
export {home}
