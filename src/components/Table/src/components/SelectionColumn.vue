<template>
  <ElTableColumn :width="width" :resizable="false" :fixed="fixed" :align="align" :sortable="false">
    <template #default="scope">
      <span :class="prefixCls">
        <ElCheckbox v-if="type === 'checkbox'" :model-value="getStatus(scope)" />
        <ElRadio :model-value="getStatus(scope)" v-else />
      </span>
    </template>
  </ElTableColumn>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useTableContext } from '../composables/useTableContext'
import type { TableRowSelection } from '../types/table'
import { useDesign } from '/@/composables/core/useDesign'

/**
 * 原有的type = selection中选中项的粒度不够细，采用自定义列方案
 */
defineProps({
  type: {
    type: String as PropType<TableRowSelection['type']>,
    default: 'radio',
  },
  fixed: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 50,
  },
  align: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'center',
  },
})

const { prefixCls } = useDesign('basic-table-selection-column')

const instance = useTableContext()

function getStatus(scope: any): boolean {
  console.log(scope)
  console.log(instance)
  return false
}
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-basic-table-selection-column;

.#{$prefixCls} {
  .el-radio {
    .el-radio__label {
      padding-left: 0;
    }
  }
}
</style>
