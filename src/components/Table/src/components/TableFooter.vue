<template>
  <div :class="getFooterClass">
    <ElPagination
      v-bind="pagination"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import type { PaginationProps } from '../types/pagination'

import { computed } from 'vue'
import { useDesign } from '/@/composables/core/useDesign'

const props = defineProps({
  pagination: {
    type: Object as PropType<PaginationProps>,
  },
})

const emit = defineEmits(['current-page', 'page-size'])

const { prefixCls } = useDesign('basic-table-footer')

const getFooterClass = computed(() => {
  return [prefixCls, props.pagination?.position || 'right']
})

function handlePageChange(page: number) {
  emit('current-page', page)
}

function handleSizeChange(size: number) {
  emit('page-size', size)
}
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-basic-table-footer;

.#{$prefixCls} {
  display: flex;
  flex-direction: row;
  overflow: hidden;

  &.left {
    justify-content: flex-start;
  }

  &.right {
    justify-content: flex-end;
  }

  .el-pagination {
    margin: 8px 0;
  }
}
</style>
