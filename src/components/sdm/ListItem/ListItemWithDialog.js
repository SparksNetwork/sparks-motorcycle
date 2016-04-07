import {map, combineArray} from 'most'
import {div} from '@motorcycle/dom'
import isolate from '@cycle/isolate'

import {ListItemClickable} from './ListItemClickable'
import {Dialog} from 'components/sdm'

const toTrue = () => true

const view = (...children) => div({}, children)

export function ListItemWithDialog(sources) {
  const li = isolate(ListItemClickable, 'dialog-clickable')(sources)
  const iconName$ = sources.dialogIconName$ || sources.iconName$

  const dialog = Dialog({...sources,
    isOpen$: map(toTrue, li.click$),
    title$: sources.title$,
    content$: sources.content$,
    iconName$,
  })

  const DOM = combineArray(view, [li.DOM, dialog.DOM])

  return {DOM, submit$: dialog.submit$}
}
