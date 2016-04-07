import {just, merge, combine} from 'most'
import {div} from '@motorcycle/dom'

import {RaisedButton} from 'components/sdm'
import {isolate, PROVIDERS} from 'util'

const view = (...children) => div({}, children)

export function LoginButtons(sources) {
  const goog =
    isolate(RaisedButton)({label$: just('Login with Google'), ...sources})
  const fb =
    isolate(RaisedButton)({label$: just('Login with Facebook'), ...sources})

  const auth$ = merge(
    goog.click$.map(() => PROVIDERS.google),
    fb.click$.map(() => PROVIDERS.facebook),
  )

  return {
    DOM: combine(view, goog.DOM, fb.DOM),
    auth$,
  }
}
