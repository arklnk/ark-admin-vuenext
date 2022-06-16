import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps, GetRowKey, Key } from '../types/table'

import { unref, computed, shallowRef, watch, watchEffect, ref } from 'vue'
import { DEFAULT_CHILDREN_KEY } from '../const'
import { get } from 'lodash-es'

interface MapCache<T = Recordable> {
  kvMap?: Map<Key, T>
}

export function useRowSelection(
  getProps: ComputedRef<BasicTableProps>,
  tableDataRef: Ref<readonly Recordable[]>,
  _emit: EmitFn
) {
  const selectedRowKeysRef = ref<Key[]>([])

  watch(
    () => unref(getRowSelection).selectedRowKeys,
    (v: Key[] | undefined) => {
      if (v) {
        selectedRowKeysRef.value = v
      }
    }
  )

  const getRowSelection = computed(() => {
    const temp = unref(getProps).rowSelection || {}
    return {
      ...temp,
    }
  })

  const getRowKey = computed((): GetRowKey => {
    if (typeof unref(getProps).rowKey === 'function') {
      return unref(getProps).rowKey as GetRowKey
    }

    return (record: Recordable) => get(record, unref(getProps).rowKey as string)
  })

  const getChildrenName = computed(() => {
    return unref(getProps).treeProps?.children || DEFAULT_CHILDREN_KEY
  })

  const tableDataKVMapCacheRef = shallowRef<MapCache>({})
  watch(
    [tableDataRef, getChildrenName, getRowKey],
    () => {
      const kvMap = new Map<Key, Recordable>()
      const rowKeyFunc = getRowKey.value
      const childrenName = getChildrenName.value

      function dig(records: readonly Recordable[]) {
        records.forEach((record, index) => {
          const key = rowKeyFunc(record, index)
          kvMap.set(key, record)

          if (record && typeof record === 'object' && childrenName in record) {
            dig(record[childrenName] || [])
          }
        })
      }

      dig(tableDataRef.value)

      tableDataKVMapCacheRef.value = {
        kvMap,
      }
    },
    {
      deep: true,
      immediate: true,
    }
  )

  function getRecordByKey(key: Key): Recordable {
    return tableDataKVMapCacheRef.value.kvMap!.get(key)!
  }

  // Cache
  const preserveRecordsRef = shallowRef<Map<Key, Recordable>>(new Map())

  function updatePreserveRecordsCache(keys: Key[]) {
    if (unref(getRowSelection).clearOnPageChange) {
      const newCache = new Map<Key, Recordable>()
      // Keep key if mark as preserveSelectedRowKeys
      keys.forEach((key) => {
        let record = getRecordByKey(key)

        if (!record && preserveRecordsRef.value.has(key)) {
          record = preserveRecordsRef.value.get(key)!
        }

        newCache.set(key, record)
      })

      preserveRecordsRef.value = newCache
    }
  }

  watchEffect(() => {
    updatePreserveRecordsCache(selectedRowKeysRef.value)
  })

  function _setSelectedKeys(keys: Key[]) {
    let availableKeys: Key[]
    let records: Recordable[]
    if (unref(getRowSelection).clearOnPageChange) {
      availableKeys = keys
      records = keys.map((key) => unref(preserveRecordsRef).get(key)!)
    } else {
      // Filter key which not exist in the `dataSource`
      availableKeys = []
      records = []
    }

    console.log(availableKeys, records)
  }

  return {}
}
