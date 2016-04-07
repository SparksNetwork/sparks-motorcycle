import './styles.scss'

import {combineArray, merge} from 'most'

import {
  AppMenu,
  LoginButtons} from 'components/ui'

import {landing} from './view'

export function Landing(sources) {
  const appMenu = AppMenu(sources)
  const logins = LoginButtons(sources)

  const DOM = combineArray(landing, [appMenu.DOM, logins.DOM])
  const auth$ = merge(logins.auth$, appMenu.auth$)

  return {DOM, auth$, route$: sources.redirectLogin$}
}
