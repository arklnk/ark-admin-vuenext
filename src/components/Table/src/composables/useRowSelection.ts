import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps, GetRowKey, Key } from '../types/table'

import { unref, computed, shallowRef, watch, ref } from 'vue'
import { DEFAULT_CHILDREN_KEY } from '../const'
import { get, isFunction } from 'lodash-es'
import { arrDel, arrAdd } from '../util'

interface MapCache<T = Recordable> {
  kvMap?: Map<Key, T>
}

export function useRowSelection(
  getProps: ComputedRef<BasicTableProps>,
  tableDataRef: Ref<readonly Recordable[]>,
  emit: EmitFn
) {
  const getRowSelection = computed(() => {
    const temp = unref(getProps).rowSelection || {}
    return {
      ...temp,
    }
  })

  const getIsCheckboxType = computed(() => {
    return getRowSelection.value.type === 'checkbox'
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
    selectedRowKeysRef.value = unref(getRowSelection).clearOnPageChange
      ? selectedRowKeysRef.value.concat(keys)
      : keys
  }

  const getSelectedRowKeySet = computed((): Set<Key> => {
    const keys = getIsCheckboxType.value
      ? selectedRowKeysRef.value
      : selectedRowKeysRef.value.slice(0, 1)
    return new Set(keys)
  })

  function triggerSingleSelection(key: Key, checked: boolean, keys: Key[]) {
    emit('select', checked, key)

    setSelectedKeys(keys)
  }

  function triggerAllSelection(checked: boolean, keys: Key[]) {
    emit('select-all', checked, keys)

    setSelectedKeys(keys)
  }

  function isRowSelectable(record: any): boolean {
    let selectable = true
    if (getRowSelection.value.selectable && isFunction(getRowSelection.value.selectable)) {
      selectable = getRowSelection.value.selectable(record)
    }

    return selectable
  }

  function getCellCheckboxProps(record: any): Recordable {
    const key = getRowKey.value(record)
    const checked = getSelectedRowKeySet.value.has(key as unknown as Key)

    return {
      modelValue: checked,
      size: getProps.value.size,
      disabled: !isRowSelectable(record),
      onclick: (e: Event) => e.stopPropagation(),
      onChange: (_checked: boolean) => {
        if (!getIsCheckboxType.value) {
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

  function getHeaderCheckboxProps(): Recordable {
    const keySet = new Set(getSelectedRowKeySet.value)
    const recordKeys = Array.from(tableDataKVMapCacheRef.value.kvMap!.keys())

    const checkedCurrentAll = recordKeys
      .filter((key) => {
        const record = getRecordByKey(key)
        return isRowSelectable(record)
      })
      .every((key) => keySet.has(key))

    return {
      modelValue: checkedCurrentAll,
      size: getProps.value.size,
      disabled: tableDataRef.value.length <= 0,
      onclick: (e: Event) => e.stopPropagation(),
      onChange: (_checked: boolean) => {
        if (checkedCurrentAll) {
          // 全选状态时去取消所有
          recordKeys.forEach((key) => {
            const record = getRecordByKey(key)
            if (isRowSelectable(record)) {
              keySet.delete(key)
            }
          })
        } else {
          // 未全选状态时则选中所有
          recordKeys.forEach((key) => {
            const record = getRecordByKey(key)
            if (!keySet.has(key) && isRowSelectable(record)) {
              keySet.add(key)
            }
          })
        }

        const keys = Array.from(keySet)

        triggerAllSelection(!checkedCurrentAll, keys)
      },
    }
  }

  function clearSelectedKeys() {
    selectedRowKeysRef.value = []
  }

  function getSelectedKeys() {
    return unref(selectedRowKeysRef)
  }

  return {
    getCellCheckboxProps,
    getHeaderCheckboxProps,
    getIsCheckboxType,
    clearSelectedKeys,

    getSelectedKeys,
  }
}
