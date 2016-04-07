import './styles.scss'

import {just, merge, map, combine, multicast} from 'most'
import hold from '@most/hold'
import {div} from '@motorcycle/dom'

import {Fab, Menu, ListItemClickable} from 'components/sdm'
import {icon} from 'helpers'
//import {pluck} from 'util/most'
import {isolate, PROVIDERS} from 'util'

/*
function Dash(sources) {
  const iconName$ = just('home')
  const title$ = pluck('fullName', sources.userProfile$)
  return isolate(ListItemClickable)({...sources, iconName$, title$})
}*/

function Admin(sources) {
  const iconName$ = just('build')
  const title$ = just('Admin')
  return isolate(ListItemClickable)({...sources, iconName$, title$})
}

function Logout(sources) {
  const iconName$ = just('sign-out')
  const title$ = just('Logout')
  return isolate(ListItemClickable)({...sources, iconName$, title$})
}

function GoogleLogin(sources) {
  const iconName$ = just('google-plus-square')
  const title$ = just('Login with Google')
  return isolate(ListItemClickable)({...sources, iconName$, title$})
}

export function AppMenu(sources) {
  const fab = Fab({icon$: just(icon('more_vert')), ...sources})
  //const dash = Dash(sources)
  const admin = Admin(sources)
  const logout = Logout(sources)
  const googleLogin = GoogleLogin(sources)

  const isOpen$ = fab.click$.startWith(false)

  const menuItems$ = hold(map(
    userProfile => userProfile ?
      [
        //dash.DOM.startWith(null),
        userProfile.isAdmin ? admin.DOM : null,
        logout.DOM,
      ] : [googleLogin.DOM],
    sources.userProfile$.startWith(null)
  ))

  const menu = Menu({isOpen$, menuItems$, leftAlign$: just(false), ...sources})

  const DOM =
    combine((...children) => div('.app-menu', {}, children), fab.DOM, menu.DOM)

  const auth$ = merge(
    map(() => PROVIDERS.google, googleLogin.click$),
    map(() => PROVIDERS.logout, logout.click$)
  )

  const route$ = multicast(merge(
    //dash.click$.map(() => '/dash'),
    admin.click$.map(() => '/admin')
  ))

  return {DOM, auth$, route$}
}
