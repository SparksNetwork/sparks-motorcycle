import {Toolbar} from 'components/sdm'
import {AppMenu, HeaderLogo} from 'components/ui'

export function AppBar(sources) {
  const appMenu = AppMenu(sources)
  const headerLogo = HeaderLogo(sources)
  const toolbar = Toolbar({
    ...sources,
    title$: headerLogo.DOM,
    rightItem$: appMenu.DOM,
  })

  return {
    auth$: appMenu.auth$,
    route$: appMenu.route$,
    ...toolbar,
  }
}
