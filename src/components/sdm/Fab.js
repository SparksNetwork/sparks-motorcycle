import {just, empty, combineArray} from 'most'
import {Appbar} from 'snabbdom-material'

import {clickEvent} from 'util'

function view(icon, classNames) {
  return Appbar.Button({
    onClick: true,
    primary: true,
    className: ['fab-button', ...classNames].join(' '),
  }, [icon])
}

export function Fab(sources) {
  const click$ = clickEvent(sources.DOM, '.fab-button')
  const classNames$ = sources.classNames$ || just([])
  const DOM = combineArray(view, [sources.icon$ || empty(), classNames$])
  return {DOM, click$}
}
