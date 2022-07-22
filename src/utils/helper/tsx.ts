import type { Slots } from 'vue'

import { isFunction } from 'lodash-es'

export function getSlot(slots: Slots, name = 'default', data?: any) {
  if (!slots || !Reflect.has(slots, name)) {
    return null
  }

  const slotFn = slots[name]
  if (!slotFn) return
  if (!isFunction(slotFn)) return

  return slotFn(data)
}
