import type { Key } from './types/table'

export function arrDel(list: Key[], value: Key) {
  if (!list) return []
  const clone = list.slice()
  const index = clone.indexOf(value)
  if (index >= 0) {
    clone.splice(index, 1)
  }
  return clone
}

export function arrAdd(list: Key[], value: Key) {
  const clone = (list || []).slice()
  if (clone.indexOf(value) === -1) {
    clone.push(value)
  }
  return clone
}
