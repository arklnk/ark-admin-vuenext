<template>
  <div :class="prefixCls">
    <div v-if="$slots.headerTop" class="m-1.25">
      <slot name="headerTop"></slot>
    </div>
    <div :class="`${prefixCls}__toolbar`">
      <div class="flex-1">
        <slot name="toolbar"></slot>
      </div>
      <ElDivider v-if="$slots.toolbar && showTableSetting" direction="vertical" />
      <BasicTableSetting />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableSetting } from '../types/table'
import { useDesign } from '/@/composables/core/useDesign'
import BasicTableSetting from './settings/index.vue'

defineProps({
  showTableSetting: {
    type: Boolean,
  },
  tableSetting: {
    type: Object as PropType<TableSetting>,
  },
})

const { prefixCls } = useDesign('basic-table-header')
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-basic-table-header;

.#{$prefixCls} {
  width: 100%;

  &__toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      color: var(--el-text-color-regular);
      font-size: 20px;
      margin: 0 6px;
      cursor: pointer;
    }
  }
}
</style>
