import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps, Key } from '../types/table'

import { unref, computed, shallowRef } from 'vue'

export function useRowSelection(
  props: ComputedRef<BasicTableProps>,
  _tableData: Ref<Recordable[]>,
  _emit: EmitFn
) {
  const mergedRowSelectionRef = computed(() => {
    const temp = unref(props).rowSelection || {}
    return {
      ...temp,
    }
  })

  const preserveRecordsCache = shallowRef<Map<Key, Recordable>>(new Map())

  function _updatePreserveRecordsCache(keys: Key[]) {
    if (unref(mergedRowSelectionRef).clearOnPageChange) {
      const newCache = new Map<Key, Recordable>()
      // Keep key if mark as preserveSelectedRowKeys
      keys.forEach(() => {
        
      })

      preserveRecordsCache.value = newCache
    }
  }

  function _setSelectedKeys(keys: Key[]) {
    let availableKeys: Key[]
    let records: Recordable[]
    if (unref(mergedRowSelectionRef).clearOnPageChange) {
      availableKeys = keys
      records = keys.map((key) => unref(preserveRecordsCache).get(key)!)
    } else {
      // Filter key which not exist in the `dataSource`
      availableKeys = []
      records = []
    }

    console.log(availableKeys, records)
  }

  return {
    mergedRowSelectionRef,
  }
}
