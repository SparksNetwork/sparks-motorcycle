import './styles.scss'

import {just, combineArray} from 'most'
import {div} from '@motorcycle/dom'
import {Appbar} from 'snabbdom-material'

import {icon} from 'helpers'

const sparkly = '/' + require('images/pitch/sparklerHeader-2048.jpg')

const bgStyle = url => ({
  backgroundImage: url &&
    'linear-gradient(rgba(0,0,0,0.40),rgba(0,0,0,0.60)), url(' + url + ')' ||
    'linear-gradient(rgba(0,0,0,0.40),rgba(0,0,0,0.60))',
})

const contentView = (top, left, title, subtitle, right) =>
  div('.content', {}, [
    top,
    div('.bottom', {}, [
      left && div('.left', {}, [left]),
      div('.main', {}, [
        div('.title', {}, [title]),
        subtitle && div('.subtitle', {}, [subtitle]),
      ]),
      right && div('.right', {}, [right]),
    ]),
  ])

function TitleContent(sources) {
  const DOM = combineArray(contentView, [
    sources.top$ || just(null),
    sources.left$ || just(null),
    sources.title$ || just('no titleDOM$'),
    sources.subtitle$ || just(null),
    sources.right$ || just(null),
  ])
  return {DOM}
}

const sidenavButton =
  Appbar.Button({className: 'nav-button'}, [icon('menu')])

function responsiveView(isMobile, url, classes, content, tabs) {
  return div('.title-block',
    {style: bgStyle(url || sparkly)},
    isMobile ? [content, tabs] : [content]
  )
}

export function ResponsiveTitle(sources) {
  const rightView$ = just(sidenavButton)
  const right$ = sources.isMobile$
    .map(m => m && rightView$ || just(null))
    .switch()
  const content = TitleContent({...sources, right$})
  const url$ = sources.backgroundUrl$ || just(null)
  const classes$ = sources.classes$ || just([])

  const DOM = combineArray(responsiveView, [
    sources.isMobile$,
    url$,
    classes$,
    content.DOM,
    sources.tabs$,
  ])
  return {DOM}
}

const style = (bgUrl) => ({
  backgroundImage: bgUrl &&
    'linear-gradient(rgba(0,0,0,0.60),rgba(0,0,0,0.90)), url(' + bgUrl + ')' ||
    'linear-gradient(rgba(0,0,0,0.80),rgba(0,0,0,0.80))',
  zIndex: 0,
  color: 'white',
  minHeight: '120px',
  backgroundSize: 'cover',
})

const titleView = (isMobile, label, bgUrl, subLabel, tabs, quickNav) => // eslint-disable-line
  div('.title', {style: style(bgUrl)}, [
    quickNav,
    div({style: {padding: '0.5em', lineHeight: '48px'}}, [
      isMobile && Appbar.Button({className: 'nav-button'}, [icon('menu')]),
      div({style: {lineHeight: '24px'}}, [
        div({style: {fontSize: '18px', fontWeight: 'bold'}}, [label]),
        div({style: {fontSize: '14px'}}, [subLabel]),
      ]),
    ]),
    isMobile ? tabs : null,
  ])

export function Title(sources) {
  const DOM = combineArray(titleView, [
    sources.isMobile$,
    sources.labelText$,
    sources.backgroundUrl$ || just(null),
    sources.subLabelText$ || just(null),
    sources.tabs$ || just(null),
    sources.quickNav$ || just(null),
  ])
  return {DOM}
}
