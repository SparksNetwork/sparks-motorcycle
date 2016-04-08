import {just, combineArray} from 'most'
import {Button} from 'snabbdom-material'

import {clickEvent} from 'util'

const view = (label, classNames) =>
  Button({
    onClick: true,
    flat: true,
    className: ['flat-button', ...classNames].join(' '),
  }, [label])

export function FlatButton(sources) {
  const click$ = clickEvent(sources.DOM, '.flat-button')
  const label$ = sources.label$ || just('Button')
  const classNames$ = sources.classNames$ || just([])

  const DOM = combineArray(view, [label$, classNames$])

  return {DOM, click$}
}
