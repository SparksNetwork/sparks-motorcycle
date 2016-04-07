import {combineArray} from 'most'

export function combineObj(obj) {
  const keys = Object.keys(obj)
  const length = keys.length

  const sources = new Array(length)
  const sanitizedKeys = new Array(length)

  let i = 0
  for (; i < length; ++i) {
    sanitizedKeys[i] = keys[i].replace(/\$$/, '')
    sources[i] = obj[keys[i]]
  }

  return combineArray((...args) => {
    const combination = {}

    for (i = 0; i < length; ++i) {
      combination[sanitizedKeys[i]] = args[i]
    }

    return combination
  }, sources)
}
