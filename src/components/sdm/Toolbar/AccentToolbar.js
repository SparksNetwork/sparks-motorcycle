import {just, map} from 'most'
import {div} from '@motorcycle/dom'
import {Appbar} from 'snabbdom-material'

import {material} from 'util'
import {combineObj} from 'util/most'

const view = ({leftView, title, rightView}) =>
  Appbar({material}, [
    div({style: {float: 'left'}}, [leftView]),
    Appbar.Title({style: {float: 'left'}}, [title]),
    div({style: {float: 'right'}}, [rightView]),
  ])

export function AccentToolbar(sources) {
  const leftView$ = sources.leftView$ || just(null)
  const title$ = sources.title$ || just('no title$')
  const rightView$ = sources.rightView$ || just(null)
  const view$ = combineObj({leftView$, title$, rightView$})
  const DOM = map(view, view$)
  return {DOM}
}
