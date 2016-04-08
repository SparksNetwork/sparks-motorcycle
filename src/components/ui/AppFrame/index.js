import {AppBar, SideNav} from 'components/ui'

import {mobileFrame, desktopFrame} from 'helpers'
import {clickEvent} from 'util'
import {mergeLatest, combineObj, withLatestFrom} from 'util/most'

export function AppFrame(sources) {
  const appBar = AppBar(sources)
  const navButton$ = clickEvent(sources.DOM, '.nav-button')
  const sideNav = SideNav({
    content$: sources.nav$,
    isOpen$: navButton$.map(() => true).startWith(false),
    ...sources,
  })

  const children = [appBar, sideNav]
  const auth$ = mergeLatest('auth$', children)
  const route$ = mergeLatest('route$', children)

  const layoutParams$ = combineObj({
    sideNav: sideNav.DOM,
    appBar: appBar.DOM,
    header: sources.header$,
    page: sources.page$,
  })

  const DOM =
    withLatestFrom(
      (params, isMobile) => {
        return isMobile ? mobileFrame(params) : desktopFrame(params)
      },
      layoutParams$, sources.isMobile$
    )

  return {DOM, auth$, route$}
}
