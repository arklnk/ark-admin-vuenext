<template>
  <ElPopover trigger="click" placement="bottom-end" :width="260" @show="handleShow">
    <template #reference>
      <span class="i-ri:settings-6-line"></span>
    </template>

    <!-- column list -->
    <ElScrollbar height="240px" view-style="padding-right: 10px;" style="margin-right: -10px">
      <ElCheckboxGroup ref="columnRef" v-model="checkedList" size="default">
        <template v-for="item in options" :key="item.prop || item.label">
          <div class="w-full flex flex-row items-center text-sm text-primarytext">
            <span class="mr-2 i-fluent:drag-24-filled drag-icon cursor-move"></span>
            <ElCheckbox :label="item.prop || item.label">
              <span class="text-primarytext hover:text-primary font-normal">{{ item.label }}</span>
            </ElCheckbox>
            <div class="flex-1"><!--holder--></div>
            <span
              class="cursor-pointer ml-2 i-bx:bxs-arrow-to-left"
              :class="[item.fixed === 'left' ? 'text-primary' : '']"
              @click="handleColumnFixed(item, 'left')"
            ></span>
            <span
              class="cursor-pointer rotate-180 ml-2 i-bx:bxs-arrow-to-left"
              :class="[item.fixed === 'right' ? 'text-primary' : '']"
              @click="handleColumnFixed(item, 'right')"
            ></span>
          </div>
        </template>
      </ElCheckboxGroup>
    </ElScrollbar>
  </ElPopover>
</template>

<script setup lang="ts">
import type { TableColumn } from '../../types/column'

import { nextTick, reactive, ref, unref, watchEffect } from 'vue'
import { useTableContext } from '../../composables/useTableContext'
import SortableJs from 'sortablejs'
import { cloneDeep, isNil } from 'lodash-es'

// init state
const isInitedColumn = ref(false)
const isInitedSortable = ref(false)

const table = useTableContext()

const checkedList = ref<string[]>([])
const options = ref<TableColumn[]>([])
const sortOptions = ref<TableColumn[]>([])

const columnRef = ref<ComponentEl>()

function init() {
  const columns = table.getColumns()

  checkedList.value = columns.map((item) => item.prop || item.label).filter(Boolean) as string[]
  options.value = columns.map((e) => reactive(e))
  sortOptions.value = columns

  isInitedColumn.value = true
}

watchEffect(() => {
  const columns = table.getColumns()

  if (columns.length > 0 && !unref(isInitedColumn)) {
    init()
  }
})

function handleColumnFixed(item: TableColumn, fixed?: 'left' | 'right') {
  const isFixed = item.fixed === fixed ? undefined : fixed
  const columns = table.getColumns()

  const index = columns.findIndex((col) => col.prop === item.prop)
  if (index !== -1) {
    columns[index].fixed = isFixed
  }

  item.fixed = isFixed

  table.setColumns(columns)
}

function handleShow() {
  if (unref(isInitedSortable)) return

  nextTick(() => {
    SortableJs.create(unref(columnRef)!.$el!, {
      animation: 500,
      delay: 400,
      delayOnTouchOnly: true,
      handle: '.drag-icon',
      onEnd: (event) => {
        const { oldIndex, newIndex } = event
        if (isNil(oldIndex) || isNil(newIndex) || oldIndex === newIndex) return

        const newColumns = cloneDeep(unref(options))

        if (oldIndex > newIndex) {
          newColumns.splice(newIndex, 0, newColumns[oldIndex])
          newColumns.splice(oldIndex + 1, 1)
        } else {
          newColumns.splice(newIndex + 1, 0, newColumns[oldIndex])
          newColumns.splice(oldIndex, 1)
        }

        options.value = newColumns

        table.setColumns(newColumns)
      },
    })

    isInitedSortable.value = true
  })
}
</script>
