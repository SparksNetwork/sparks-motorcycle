import {just, map, merge} from 'most'
import hold from '@most/hold'

import {isolate} from './isolate'
export {isolate}

const createComponent = sources => ({path, value: Component}) =>
  Component({...sources, router: sources.router.path(path)})

export const nestedComponent = (sources, routes) => {
  const {match$} = sources.router.define(routes)
  const page$ = map(createComponent(sources), match$)
  return hold(page$)
}

export const PROVIDERS = {
  google: {type: 'popup', provider: 'google'},
  facebook: {type: 'popup', provider: 'facebook'},
  logout: {type: 'logout'},
}

export const clickEvent = (DOM, selector) =>
  merge(
    DOM.select(selector).events('touchstart', {useCapture: true}),
    DOM.select(selector).events('click'),
  )

export const byMatch = (matchDomain, matchEvent) =>
  ({domain, event}) => domain === matchDomain && event === matchEvent

export const rows = obj =>
  obj ? Object.keys(obj).map(k => ({$key: k, ...obj[k]})) : []

export const controlsFromRows = (sources, _rows, Control) =>
  _rows.map(row => isolate(Control,row.$key)({...sources, item$: just(row)}))

export const material = {
  primaryColor: '#666',
  primaryFontColor: 'rgba(255, 255, 255, 0.9)',
  primaryFontColorDisabled: 'rgba(0, 0, 0, 0.45)',
  primaryLightWaves: false,
  secondaryColor: '#009688',
  secondaryFontColor: 'rgba(255, 255, 255, 0.9)',
  secondaryFontColorDisabled: 'rgba(255, 255, 255, 0.6)',
  secondaryLightWaves: true,
  errorColor: '#C00',
  successColor: '#090',
  typographyColor: '#212121',

  sidenav: {
    width: '280px',
    left: '-290px',
    transition: 'left .3s ease-out',
    delayed: {
      left: '0',
    },
    remove: {
      left: '-290px',
    },
  },

  fadeInOut: {
    opacity: '0',
    transition: 'opacity .3s',
    delayed: {
      opacity: '1',
    },
    remove: {
      opacity: '0',
    },
  },
}
