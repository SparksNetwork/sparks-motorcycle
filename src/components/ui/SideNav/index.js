import {combineArray} from 'most'
import {div, span} from '@motorcycle/dom'
import {Mask} from 'snabbdom-material'

import {clickEvent, material} from 'util'

const defaultStyles = {
  zIndex: '1001',
  position: 'fixed',
  top: '0',
  bottom: '0',
  overflow: 'auto',
}

function renderSideNav(children) {
  const style = Object.assign(defaultStyles, material.sidenav)
  return div({}, [
    Mask({isOpen: true, material, className: 'close-sideNav'}),
    div('.sidenav.paper2', {style}, [
      span({}, children),
    ]),
  ])
}

function view(isMobile, isOpen, content) {
  if (isMobile && isOpen) {
    return renderSideNav([content])
  }
  return isMobile ? span({}, []) : div({}, [content])
}

export function SideNav(sources) {
  const close$ = clickEvent(sources.DOM, '.close-sideNav')
    .map(() => false)

  const isMobile$ = sources.isMobile$
  const isOpen$ = sources.isOpen$.merge(close$)
  const content$ = sources.content$

  const DOM = combineArray(view, [isMobile$, isOpen$, content$])
  return {DOM}
}
