<template>
  <div :class="prefixCls">
    <ElPagination
      v-bind="pagination"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import type { PaginationProps } from '../types/pagination'

import { useDesign } from '/@/composables/core/useDesign'

defineProps({
  pagination: {
    type: Object as PropType<PaginationProps>,
  },
})

defineEmits(['current-page', 'page-size'])

const { prefixCls } = useDesign('basic-table-footer')

function handlePageChange() {}

function handleSizeChange() {}
</script>
