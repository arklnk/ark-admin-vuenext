import { get } from 'lodash-es'

export function getRowIdentity<T = Recordable>(
  row: T,
  rowKey: string | ((row: T) => string)
): string {
  let targetKey: string
  if (typeof rowKey === 'function') {
    targetKey = rowKey(row)
  } else {
    targetKey = get(row, rowKey) as string
  }

  return `${targetKey}`
}
