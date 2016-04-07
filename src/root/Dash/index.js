import {just} from 'most'

import {
  AppFrame,
  Header,
  TabBar,
  ResponsiveTitle,
  MediumProfileAvatar} from 'components/ui'

import {nestedComponent} from 'util'
import {pluckSwitch, mergeOrLatest} from 'util/most'

import ComingSoon from 'components/ComingSoon'

const _Tabs = sources => TabBar({...sources,
  tabs$: just([
    {path: '/', label: 'Doing'},
    {path: '/finding', label: 'Finding'},
    {path: '/being', label: 'Being'},
  ]),
})

const _Nav = sources => ({
  DOM: sources.isMobile$.map(m => m ? null : sources.title$),
})

const _Title = sources => ResponsiveTitle({...sources,
  title$: sources.userName$,
  subtitle$: just('Welcome'),
  left$: MediumProfileAvatar({
    ...sources,
    src$: sources.portraitUrl$ || just(null),
  }).DOM,
  classes$: just(['profile']),
})

const routes = {
  '/': ComingSoon('Dash/Doing'),
  '/finding': ComingSoon('Dash/Finding'),
  '/being': ComingSoon('Dash/Being'),
}

export function Dash(sources) {
  const _sources = {
    ...sources,
    userName$: sources.userProfile$.map(up => up && up.fullName || 'None'),
    portraitUrl$: sources.userProfile$.map(up => up && up.portraitUrl),
  }

  const tabs = _Tabs(_sources)
  const title = _Title({...sources, tabs$: tabs.DOM})
  const nav = _Nav({...sources, title$: title.DOM})
  const header = Header({...sources, title$: title.DOM, tabs$: tabs.DOM})
  const page$ = nestedComponent(sources, routes)

  const pageDOM$ = pluckSwitch('DOM', page$)

  const frame = AppFrame({..._sources,
    nav$: nav.DOM,
    header$: header.DOM,
    page$: pageDOM$,
  })

  const children = [frame, tabs, title, nav, header]

  const auth$ = mergeOrLatest('auth$', children)
    .merge(pluckSwitch('auth$', page$))
  const queue$ = mergeOrLatest('queue$', children)
    .merge(pluckSwitch('queue$', page$))
  const route$ = mergeOrLatest('route$', children)
    .merge(pluckSwitch('route$', page$))

  return {
    DOM: frame.DOM,
    auth$,
    queue$,
    route$,
  }
}
