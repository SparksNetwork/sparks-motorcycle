import {div} from '@motorcycle/dom'

const view = content => div({}, [content])

export function Header(sources) {
  const DOM = sources.isMobile$
    .map(isMobile => isMobile ? sources.title$ : sources.tabs$)
    .switch()
    .map(view)

  return {DOM}
}
