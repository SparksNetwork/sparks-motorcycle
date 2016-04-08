import {run} from '@motorcycle/core'
import {makeDOMDriver} from '@motorcycle/dom'
import {makeRouterDriver, supportsHistory} from '@motorcycle/router'
import {createHistory, createHashHistory} from 'history'
import Firebase from 'firebase'
import {
  makeAuthDriver,
  makeFirebaseDriver,
  makeQueueDriver} from 'drivers/firebase'
import {isMobile$} from 'drivers/isMobile'

import Root from './root'

const history = supportsHistory() ?
  createHistory() : createHashHistory()

const fbRoot = new Firebase(__FIREBASE_HOST__) // eslint-disable-line

const {dispose} = run(Root, {
  isMobile$,
  DOM: makeDOMDriver('#root'),
  router: makeRouterDriver(history),
  firebase: makeFirebaseDriver(fbRoot),
  auth$: makeAuthDriver(fbRoot),
  queue$: makeQueueDriver(fbRoot.child('!queue')),
})

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => dispose())
}
