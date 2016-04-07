import {just, combineArray} from 'most'
import {Button} from 'snabbdom-material'

import {clickEvent} from 'util'

const view = (label, classNames) =>
  Button({
    onClick: true,
    primary: true,
    className: ['raised-button', ...classNames].join(' '),
  }, [label])

export function RaisedButton(sources) {
  const click$ = sources.DOM.select('.raised-button').events(clickEvent)
  const label$ = sources.label$ || just('Button')
  const classNames$ = sources.classNames$ || just([])

  const DOM = combineArray(view, [label$, classNames$])

  return {DOM, click$}
}
