import {just} from 'most'
import {a, img} from '@motorcycle/dom'

const src = require('images/sn-logo-32.png')

const view =
  a({props: {href: '/'}}, [
    img({
      style: {height: '24px', float: 'left'},
      attrs: {src: '/' + src},
    }),
  ])

export function HeaderLogo() {
  const DOM = just(view)
  return {DOM}
}
