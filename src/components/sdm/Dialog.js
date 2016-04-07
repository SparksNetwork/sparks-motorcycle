import {map, merge} from 'most'
import {div} from '@motorcycle/dom'
import {Dialog as SmDialog} from 'snabbdom-material'

import {
  OkAndCancel,
  AccentToolbar} from 'components/sdm'
import {icon} from 'helpers'
import {clickEvent} from 'util'
import {combineObj} from 'util/most'

const dialogStyle = {
  minWidth: '400px',
}

const contentStyle = {
  padding: '0em 1em 1em 1em',
}

function modal({isOpen, toolbar, content, actions}) {
  return SmDialog({
    isOpen,
    title: toolbar,
    footer: actions,
    noPadding: true,
    style: dialogStyle,
  }, [
    div({style: contentStyle}, [content]),
  ])
}

const toFalse = () => false

export function Dialog(sources) {
  const maskClose$ = sources.DOM.select('.close').events(clickEvent)
  const oac = OkAndCancel(sources)
  const leftView$ = map(icon, sources.iconName$)
  const toolbar = AccentToolbar({...sources, leftView$})

  const isOpen$ = merge(
    sources.isOpen$,
    map(toFalse, oac.ok$),
    map(toFalse, oac.cancel$),
    map(toFalse, maskClose$)
  ).startWith(false)

  const DOM = map(modal, combineObj({
    isOpen$,
    toolbar: toolbar.DOM,
    content: sources.content$,
    actions: oac.DOM,
  }))

  return {
    DOM,
    submit$: oac.ok$,
    close$: oac.cancel$,
  }
}
