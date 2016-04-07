import './styles.scss'

import {map, merge, startWith, just, combineArray} from 'most'
import {Mask, getScreenSize} from 'snabbdom-material'
import {div} from '@motorcycle/dom'

import {menuItem} from 'helpers'
import {clickEvent} from 'util'

const style = {
  delayed: {
    opacity: '1',
  },
  remove: {
    opacity: '0',
  },
}

function insert(vnode) {
  const {height: screenHeight} = getScreenSize()
  const {top, bottom} = vnode.elm.getBoundingClientRect()
  const originalHeight = bottom - top
  const minHeight = 32 * 8 + 20

  let offsetTop = top < 6 ? Math.ceil((top - 16) / -32) * 32 : 0
  const offsetBottom = bottom > screenHeight - 6 ?
    Math.ceil((bottom - screenHeight + 16) / 32) * 32 : 0
  let height = bottom - top - offsetTop - offsetBottom
  if (height < minHeight) {
    height = minHeight > originalHeight ? originalHeight : minHeight
    if (top + offsetTop + height + 16 > screenHeight) {
      offsetTop -= top + offsetTop + height + 16 - screenHeight
    }
  }
  vnode.elm.style.top = `${vnode.elm.offsetTop + offsetTop}px`
  vnode.elm.style.height = `${height}px`
  vnode.elm.scrollTop += offsetTop
}

function menuView(isOpen, children, leftAlign) {
  return div('.menu', {}, [
    Mask({className: 'close', dark: false, isOpen}),
    isOpen ? div('.menu-contents.paper1', {
      style,
      hook: {insert},
      class: {left: leftAlign, right: !leftAlign},
    }, children) : null,
  ])
}

export function Menu(sources) {
  const click$ = sources.DOM.select('.close').events(clickEvent)
  const isOpen$ =
    startWith(false, merge(sources.isOpen$, map(() => false, click$)))

  const DOM = combineArray(menuView, [
    isOpen$,
    sources.menuItems$ || just([]),
    sources.leftAlign$ || just(true),
  ])

  return {DOM}
}

const menuItemView = (iconName, title) =>
  div({}, [
    menuItem({
      title,
      iconName,
      className: 'item',
      clickable: true,
    }),
  ])

export function MenuItem(sources) {
  const click$ = sources.DOM.select('.item').events(clickEvent)
  const iconName$ = sources.iconName$ || just(null)
  const title$ = sources.title || just('no title$')
  const DOM = combineArray(menuItemView, [iconName$, title$])
  return {DOM, click$}
}
