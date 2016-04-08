import {just, combineArray} from 'most'
import hold from '@most/hold'
import {div} from '@motorcycle/dom'

import {FlatButton} from './FlatButton'
import {RaisedButton} from './RaisedButton'

const view = (...children) => div({}, children)

export function OkAndCancel(sources) {
  const okLabel$ = sources.okLabel$ || just('OK')
  const ok = RaisedButton({...sources, label$: okLabel$})

  const cancelLabel$ = sources.cancelLabel$ || just('Cancel')
  const cancel = FlatButton({...sources, label$: cancelLabel$})

  const DOM = combineArray(view, [ok.DOM, cancel.DOM])
  return {
    DOM,
    ok$: ok.click$.multicast(),
    cancel$: cancel.click$.multicast(),
  }
}
