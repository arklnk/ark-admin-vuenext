import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps, GetRowKey, Key } from '../types/table'

import { unref, computed, shallowRef, watch, ref } from 'vue'
import { DEFAULT_CHILDREN_KEY } from '../const'
import { get } from 'lodash-es'
import { arrDel, arrAdd } from '../util'

interface MapCache<T = Recordable> {
  kvMap?: Map<Key, T>
}

export function useRowSelection(
  getProps: ComputedRef<BasicTableProps>,
  tableDataRef: Ref<readonly Recordable[]>,
  _emit: EmitFn
) {
  const getRowSelection = computed(() => {
    const temp = unref(getProps).rowSelection || {}
    return {
      ...temp,
    }
  })

  const selectedRowKeysRef = ref<Key[]>(unref(getRowSelection).selectedRowKeys || [])

  watch(
    () => unref(getRowSelection).selectedRowKeys,
    (v: Key[] | undefined) => {
      if (v) {
        setSelectedKeys(v)
      }
    },
    {
      deep: true,
    }
  )

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

  function setSelectedKeys(keys: Key[]) {
    const availableKeys: Key[] = []
    const records: Recordable[] = []

    // filter key which not exist in the `dataSource`
    keys.forEach((key) => {
      const record = getRecordByKey(key)
      if (record) {
        records.push(record)
        availableKeys.push(key)
      }
    })

    selectedRowKeysRef.value = unref(getRowSelection).clearOnPageChange
      ? selectedRowKeysRef.value.concat(availableKeys)
      : availableKeys
  }

  function clearSelectedKeys() {
    selectedRowKeysRef.value = []
  }

  const getSelectedRowKeySet = computed((): Set<Key> => {
    const keys =
      getRowSelection.value.type === 'radio'
        ? selectedRowKeysRef.value.splice(0, 1)
        : selectedRowKeysRef.value
    return new Set(keys)
  })

  function triggerSingleSelection(key: Key, checked: boolean, keys: Key[]) {
    setSelectedKeys(keys)
  }

  function getCheckboxProps(record: any): Recordable {
    const key = getRowKey.value(record)
    const checked = getSelectedRowKeySet.value.has(key as unknown as Key)

    return {
      modelValue: checked,
      size: getProps.value.size,
      onclick: (e: Event) => e.stopPropagation(),
      onChange: (_checked: boolean) => {
        if (unref(getRowSelection).type === 'radio') {
          const checkedKeys = !checked ? [key] : []

          triggerSingleSelection(key, !checked, checkedKeys)
        } else {
          const originCheckedKeys = selectedRowKeysRef.value
          const checkedKeys = checked
            ? arrDel(originCheckedKeys, key)
            : arrAdd(originCheckedKeys, key)

          triggerSingleSelection(key, !checked, checkedKeys)
        }
      },
    }
  }

  return {
    clearSelectedKeys,
    getCheckboxProps,
  }
}
