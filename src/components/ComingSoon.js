import {just} from 'most'
import {h1} from '@motorcycle/dom'

export default (message) => () =>
  ({DOM: just(h1({}, [`Coming Soon ${message}!`]))})
