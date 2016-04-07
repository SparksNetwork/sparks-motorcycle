import {merge, empty} from 'most'
import {map} from '@most/prelude' // faster userland Array map()

const EMPTY = empty()

const isStream = x => typeof x.observe === 'function'

const mapLatest = (prop) => (c) =>
  isStream(c) ?
    c.map(x => x[prop] || EMPTY).switch() :
    c[prop] || EMPTY

const mergeOrLatest = (prop, components) =>
  merge(...map(mapLatest(prop), components))

export {mergeOrLatest}
