import {AppBar, SideNav} from 'components/ui'

import {mobileFrame, desktopFrame} from 'helpers'
import {clickEvent} from 'util'
import {mergeOrLatest} from 'util/most'

export function AppFrame(sources) {
  const appBar = AppBar(sources)
  const navButton$ = sources.DOM.select('.nav-button').events(clickEvent)
  const sideNav = SideNav({
    content$: sources.nav$,
    isOpen$: navButton$.map(() => true).startWith(false),
    ...sources,
  })

  const children = [appBar, sideNav]
  const auth$ = mergeOrLatest('auth$', children)
  const route$ = mergeOrLatest('route$', children)

  const layoutParams = {
    sideNav: sideNav.DOM,
    appBar: appBar.DOM,
    header: sources.header$,
    page: sources.page$,
  }

  const DOM = sources.isMobile$.map(isMobile =>
    isMobile ? mobileFrame(layoutParams) : desktopFrame(layoutParams)
  )

  return {DOM, auth$, route$}
}
