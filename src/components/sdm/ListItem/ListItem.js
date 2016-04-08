import {just, combineArray} from 'most'
import {div} from '@motorcycle/dom'
import {icon, iconSrc} from 'helpers'

const Icon = sources => ({
  DOM: sources.iconName$ && sources.iconName$.map(n => icon(n)) ||
    sources.iconSrc$ && sources.iconSrc$.map(url => iconSrc(url)) ||
    null,
})

const liClasses = {'list-item': true}

const contentClass = (...views) =>
  `.content.xcol-sm-${12 - views.filter(Boolean).length}`

function listItemView(classes, leftView, title, //eslint-disable-line
                      subtitle, rightView, isVisible) {
  return isVisible ? div({}, [
    div({class: {...liClasses, ...classes}}, [
      leftView && div('.left.xcol-sm-1', [leftView]),

      div(contentClass(leftView, rightView), [
        div('.title', [title]),
        subtitle && div('subtitle', [subtitle]),
      ].filter(Boolean)),

      rightView && div('.right.xcol-sm-1', [rightView]),
    ].filter(Boolean))]) : null
}

export function ListItem(sources) {
  const classes$ = sources.classes$ || just({})
  const leftView$ = sources.leftView$ || Icon(sources).DOM || just(null)
  const title$ = sources.title$ || just('no title$')
  const subtitle$ = sources.subtitle$ || just(null)
  const rightView$ = sources.rightView$ || just(null)
  const isVisible$ = sources.isVisible$ || just(true)

  const DOM = combineArray(listItemView, [
    classes$,
    leftView$,
    title$,
    subtitle$,
    rightView$,
    isVisible$,
  ])
  return {DOM}
}

export function ListItemHeader(sources) {
  return ListItem({...sources, classes$: just({header: true})})
}
