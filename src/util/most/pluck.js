import {never} from 'most'
import {reduce} from '@most/prelude'

const pluck = (...args) => (obj) =>
  reduce((acc, prop) => acc[prop] || never(), obj, args)

export {pluck}
