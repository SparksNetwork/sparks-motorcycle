// webpack magic
import 'normalize-css'
import '!style!css!snabbdom-material/lib/index.css'
import './styles.scss'

//most stuff
import {merge} from 'most'
import hold from '@most/hold' // hold is shareReplay(1) equivalent

// isolate function

// Components
import {
  AuthedRedirectManager,
  AuthedResponseManager,
  AuthedActionManager,
  UserManager} from 'components/Auth'

// utilities
import {isolate, nestedComponent} from 'util'
import {pluck, pluckSwitch, pluckJoin} from 'util/most'

// Page components
import {Landing} from './Landing'
import {Dash} from './Dash'

//Route definitions on this level
const routes = {
  '/': Landing,
  '/dash': isolate(Dash),
}

function createPreviousRoute$({router}) {
  return hold(
      pluck('fullPath', router.observable)
        .scan((acc, val) => [val, acc[0]], [null, null])
        .filter(arr => arr[1] !== '/confirm')
        .map(arr => arr[1])
  )
}

function Root(sources) {
  const user = UserManager(sources)
  const redirects = AuthedRedirectManager({...user, ...sources})
  const {responses$} = AuthedResponseManager(sources)
  const previousRoute$ = createPreviousRoute$(sources)

  const appendedSources = {
    ...sources,
    ...user,
    ...redirects,
    responses$,
    previousRoute$,
  }

  const page$ = nestedComponent(appendedSources, routes)

  const DOM = pluckSwitch('DOM', page$)
  const auth$ = pluckSwitch('auth$', page$)
  const {queue$} =
    AuthedActionManager({
      ...sources,
      queue$: pluckSwitch('queue$', page$),
    })

  queue$.observe(console.log.bind(console))
  const router = merge(
    pluckJoin('route$', page$),
    redirects.redirectUnconfirmed$
  )

  return {DOM, auth$, queue$, router}
}

export {Root as default}
