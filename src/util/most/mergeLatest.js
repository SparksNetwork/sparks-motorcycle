import {merge} from 'most'
import hold from '@most/hold'
import {map} from '@most/prelude' // faster userland Array map()

import {pluck} from './pluck'

const isStream = x => typeof x.observe === 'function'

const pluckLatest = (prop) => (c) =>
  isStream(c) ? c.map(pluck(prop)).switch() : pluck(prop)(c)

const mergeLatest = (prop, components) =>
  hold(merge(...map(pluckLatest(prop), components)))

export {mergeLatest}
