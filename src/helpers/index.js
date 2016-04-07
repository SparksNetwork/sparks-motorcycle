import {h} from '@motorcycle/dom'

export const basicLink = (title, href = '') =>
  h('a', {props: {href}, style: {color: '#FFF'}}, [title])

export const icon = (name, className) =>
  h(`i.icon-${name}.${className}`, {}, [])

const iconImageStyle = {
  width: '40px',
  height: '40px',
  marginTop: '12px',
  marginLeft: '-4px', // such hax
  borderRadius: '20px',
}

export const iconSrc = src =>
  h('img', {style: iconImageStyle, attrs: {src}}, [])

export * from './menuItem'
export * from './frames'
