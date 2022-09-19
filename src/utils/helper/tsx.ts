import type { Slots } from 'vue'

import { isFunction } from 'lodash-es'

export function getSlot(slots: Readonly<Slots>, name = 'default', data?: any) {
  if (!slots || !Reflect.has(slots, name)) {
    return null
  }

  const slotFn = slots[name]
  if (!slotFn) return
  if (!isFunction(slotFn)) return

  return slotFn(data)
}

export function extendSlots(slots: Slots, excludeKeys: string[] = []) {
  const slotKeys = Object.keys(slots)

  const ret: Recordable = {}
  slotKeys.forEach((key) => {
    if (excludeKeys.includes(key)) return

    ret[key] = (scope?: any) => getSlot(slots, key, scope)
  })

  return ret
}
