<template>
  <div :class="prefixCls">
    <div v-if="$slots.headerTop" class="m-1.25">
      <slot name="headerTop"></slot>
    </div>
    <div class="flex items-center flex-row py-1">
      <div class="flex-1 relative w-0">
        <slot name="toolbar"></slot>
      </div>
      <ElDivider v-if="$slots.toolbar && showTableSetting" direction="vertical" />
      <div v-if="showTableSetting" :class="`${prefixCls}__toolbar`">
        <RedoSetting v-if="getSetting.redo" />
        <SizeSetting v-if="getSetting.size" />
        <FullscreenSetting v-if="getSetting.fullscreen" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableSetting } from '../types/table'

import { useDesign } from '/@/composables/core/useDesign'
import RedoSetting from './settings/RedoSetting.vue'
import SizeSetting from './settings/SizeSetting.vue'
import FullscreenSetting from './settings/FullscreenSetting.vue'
import { computed } from 'vue'

const props = defineProps({
  showTableSetting: {
    type: Boolean,
  },
  tableSetting: {
    type: Object as PropType<TableSetting>,
  },
})

const { prefixCls } = useDesign('basic-table-header')

const getSetting = computed((): TableSetting => {
  return {
    size: true,
    redo: true,
    fullscreen: true,
    ...(props.tableSetting || {}),
  }
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-basic-table-header;

.#{$prefixCls} {
  width: 100%;
  color: var(--el-text-color-primary);

  &__toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 0;
    margin-right: 8px;

    span {
      font-size: 20px;
      margin: 0 6px;
      cursor: pointer;
      color: var(--el-text-color-primary);
    }
  }
}
</style>
