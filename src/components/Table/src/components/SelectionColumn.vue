<template>
  <ElTableColumn :width="columnWidth" :resizable="resizable" :align="align">
    <template #default="{ row }">
      <ElCheckbox
        :size="getSize()"
        :checked="!!rowCheckMap.get(getRowIdentity(row, getRowKey))"
        :disabled="checkDisabled(row)"
        @change="(val) => handleCheckChange(row, val)"
      />
    </template>
  </ElTableColumn>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { TableRowSelection } from '../types/table'

import { isFunction } from 'lodash-es'
import { useTableContext } from '../composables/useTableContext'
import { unref, computed } from 'vue'
import { ROW_KEY } from '../const'
import { getRowIdentity } from '../util'

const props = defineProps({
  columnWidth: {
    type: [Number, String] as PropType<string | number>,
    default: 50,
  },
  fixed: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as PropType<TableRowSelection['type']>,
    default: 'checkbox',
  },
  align: {
    type: String as PropType<TableRowSelection['align']>,
    default: 'center',
  },
  resizable: {
    type: Boolean,
    default: true,
  },
  hideSelectAll: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: Function as PropType<TableRowSelection['selectable']>,
    default: null,
  },
  selectedRowKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})

const { getSize, getBindValues, deleteSelectedRowByKey } = useTableContext()

const getAutoCreateKey = computed(() => {
  return unref(getBindValues).autoCreateKey && !unref(getBindValues).rowKey
})

const getRowKey = computed(() => {
  const rowKey = unref(getBindValues).rowKey
  return unref(getAutoCreateKey) ? ROW_KEY : (rowKey as string | ((row: any) => string))
})

function checkDisabled(row: Recordable) {
  const { selectable } = props
  if (selectable && isFunction(selectable)) {
    return selectable(row)
  }
  return false
}

function handleCheckChange(row: Recordable, val: string | number | boolean) {
  const k = getRowIdentity(row, unref(getRowKey))
  if (val) {
  } else {
    deleteSelectedRowByKey(k)
  }
}

const rowCheckMap = computed(() => {
  const map = new Map<string, boolean>()
  props.selectedRowKeys.forEach((key) => map.set(key, true))
  return map
})
</script>
