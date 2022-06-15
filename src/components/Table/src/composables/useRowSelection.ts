import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps, TableRowSelection } from '../types/table'

import { ref, unref, watch, computed, toRaw, nextTick } from 'vue'
import { DEFAULT_CHILDREN_KEY, ROW_KEY } from '../const'
import { findNodeAll } from '/@/utils/helper/tree'
import { getRowIdentity } from '../util'

export function useRowSelection(
  props: ComputedRef<BasicTableProps>,
  tableData: Ref<Recordable[]>,
  emit: EmitFn
) {
  const selectedRowKeysRef = ref<string[]>([])
  const selectedRowsRef = ref<Recordable[]>([])

  watch(
    () => unref(props).rowSelection?.selectedRowKeys,
    (rowKeys: string[] | undefined) => {
      if (rowKeys) {
        setSelectedRowKeys(rowKeys as string[])
      }
    }
  )

  watch(
    () => unref(selectedRowKeysRef),
    () => {
      nextTick(() => {
        emit('selection-change')
      })
    },
    {
      deep: true,
    }
  )

  const getChildrenName = computed(() => {
    return unref(props).treeProps?.children || DEFAULT_CHILDREN_KEY
  })

  const getAutoCreateKey = computed(() => {
    return unref(props).autoCreateKey && !unref(props).rowKey
  })

  const getRowKey = computed(() => {
    const rowKey = unref(props).rowKey
    return unref(getAutoCreateKey) ? ROW_KEY : (rowKey as string | ((row: any) => string))
  })

  const getRowSelectionRef = computed((): TableRowSelection | null => {
    const { rowSelection } = unref(props)
    if (!rowSelection) {
      return null
    }
    return {
      selectedRowKeys: unref(selectedRowKeysRef),
      ...rowSelection,
    }
  })

  function setSelectedRowKeys(rowKeys: string[]) {
    selectedRowKeysRef.value = rowKeys

    const allSelectedRows = findNodeAll(
      toRaw(unref(tableData)).concat(toRaw(unref(selectedRowsRef))),
      (row) => rowKeys.includes(getRowIdentity(row, unref(getRowKey))),
      {
        children: unref(getChildrenName),
      }
    )

    // 去重
    const trueSelectedRows: any[] = []
    rowKeys.forEach((key) => {
      const found = allSelectedRows.find((row) => getRowIdentity(row, unref(getRowKey)) === key)

      found && trueSelectedRows.push(found)
    })

    selectedRowsRef.value = trueSelectedRows
  }

  function deleteSelectedRowByKey(key: string) {
    const selectedRowKeys = unref(selectedRowKeysRef)
    const keyIndex = selectedRowKeys.findIndex((item) => item === key)
    if (keyIndex === -1) {
      return
    }
    unref(selectedRowKeysRef).splice(keyIndex, 1)

    // sync remove row
    const selectedRows = unref(selectedRowsRef)
    const rowIndex = selectedRows.findIndex((row) => key === getRowIdentity(row, unref(getRowKey)))
    if (rowIndex !== -1) {
      unref(selectedRowsRef).splice(rowIndex, 1)
    }
  }

  function setSelectedRows(rows: Recordable[]) {
    selectedRowsRef.value = rows
  }

  function clearSelectedRows() {
    selectedRowKeysRef.value = []
    selectedRowsRef.value = []
  }

  function getSelectedRowKeys(): string[] {
    return unref(unref(selectedRowKeysRef))
  }

  function getSelectedRows<T = Recordable>() {
    return unref(selectedRowsRef) as T[]
  }

  return {
    getRowSelectionRef,

    getRowKey,
    clearSelectedRows,
    deleteSelectedRowByKey,
    getSelectedRows,
    setSelectedRows,
    getSelectedRowKeys,
    getRowIdentity,
  }
}
