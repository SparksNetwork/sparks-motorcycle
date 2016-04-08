import {just, combineArray} from 'most'
import {Button} from 'snabbdom-material'

import {clickEvent} from 'util'

const view = (label, classNames) =>
  Button({
    onClick: true,
    primary: true,
    className: ['raised-button', ...classNames].join(' '),
    style: {zIndex: 1000},
  }, [label])

export function RaisedButton(sources) {
  const click$ = clickEvent(sources.DOM, '.raised-button')
  const label$ = sources.label$ || just('Button')
  const classNames$ = sources.classNames$ || just([])

  const DOM = combineArray(view, [label$, classNames$])

  return {DOM, click$}
}
