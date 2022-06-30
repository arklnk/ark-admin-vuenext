// import type { BasicTableProps } from '../types/table'
import type { BasicTableActionType } from '../types/table'
import type { WatchStopHandle } from 'vue'

import { ref, onUnmounted, unref } from 'vue'
import { error } from '/@/utils/log'

type Register = (instance: BasicTableActionType) => void

export function useTable(): [Register, BasicTableActionType] {
  const tableRef = ref<Nullable<BasicTableActionType>>(null)
  const loadedRef = ref<Nullable<boolean>>(false)

  let stopWatch: WatchStopHandle

  function register(instance: BasicTableActionType) {
    onUnmounted(() => {
      tableRef.value = null
      loadedRef.value = null
    })

    if (unref(loadedRef) && instance === unref(tableRef)) return

    tableRef.value = instance
    loadedRef.value = true

    stopWatch?.()
  }

  function getTableInstance(): BasicTableActionType {
    const table = unref(tableRef)
    if (!table) {
      error(
        'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!'
      )
    }

    return table as BasicTableActionType
  }

  return [register, getTableInstance()]
}
