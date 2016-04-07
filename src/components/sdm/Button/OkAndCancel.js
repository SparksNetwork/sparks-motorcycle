import {just, combineArray} from 'most'
import isolate from '@cycle/isolate'
import {div} from '@motorcycle/dom'

import {FlatButton} from './FlatButton'
import {RaisedButton} from './RaisedButton'

const view = (...children) => div({}, children)

export function OkAndCancel(sources) {
  const okLabel$ = sources.okLabel$ || just('OK')
  const ok = isolate(RaisedButton)({...sources, label$: okLabel$})

  const cancelLabel$ = sources.cancelLabel$ || just('Cancel')
  const cancel = isolate(FlatButton)({...sources, label$: cancelLabel$})

  const DOM = combineArray(view, [ok.DOM, cancel.DOM])
  return {
    DOM,
    ok$: ok.click$,
    cancel$: cancel.click$,
  }
}
