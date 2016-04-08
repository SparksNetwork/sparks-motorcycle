import {just} from 'most'
//import {isolate} from 'util'

import {
  AppFrame,
  Header,
  TabBar,
  ResponsiveTitle,
  MediumProfileAvatar} from 'components/ui'

import {ListItemCollapsibleTextArea} from 'components/sdm'

import {nestedComponent} from 'util'
import {pluck, mergeLatest} from 'util/most'

//import {Doing} from './Doing'
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

const testTextArea = sources => ({
  DOM: ListItemCollapsibleTextArea({
    ...sources,
    title$: just('TextArea'),
    value$: just('Wtf'),
  }).DOM,
})

const routes = {
  '/': testTextArea,
  //'/': ComingSoon('Dash/Doing'), //isolate(Doing),
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

  const pageDOM$ = page$.map(pluck('DOM')).switch()

  const frame = AppFrame({..._sources,
    nav$: nav.DOM,
    header$: header.DOM,
    page$: pageDOM$,
  })

  const children = [frame, tabs, title, nav, header]

  const auth$ = mergeLatest('auth$', children)
    .merge(page$.map(pluck('auth$')).switch())
  const queue$ = mergeLatest('queue$', children)
    .merge(page$.map(pluck('queue$')).switch())
  const route$ = mergeLatest('route$', children)
    .merge(page$.chain(pluck('route$')))

  return {
    DOM: frame.DOM,
    auth$,
    queue$,
    route$,
  }
}
