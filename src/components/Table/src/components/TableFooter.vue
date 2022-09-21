<template>
  <div :class="getFooterClass">
    <ElPagination v-bind="getBindValues" />
  </div>
</template>

<script lang="ts">
import type { PaginationProps } from '../types/pagination'

import { computed, defineComponent } from 'vue'
import { useDesign } from '/@/composables/core/useDesign'
import { omit } from 'lodash-es'

const props = {
  pagination: {
    type: Object as PropType<Nullable<PaginationProps>>,
    default: null,
  },
}

export default defineComponent({
  name: 'BasicTableFooter',
  inheritAttrs: false,
  props,
  emits: ['current-page', 'page-size'],
  setup(props, { emit }) {
    const { prefixCls } = useDesign('basic-table-footer')

    const getFooterClass = computed(() => [prefixCls, props.pagination?.position || 'right'])

    function onCurrentPage(page: number) {
      emit('current-page', page)
    }

    function onPageSize(size: number) {
      emit('page-size', size)
    }

    const getBindValues = computed(() => {
      return {
        ...omit(props.pagination, 'position'),
        'onUpdate:currentPage': onCurrentPage,
        'onUpdate:pageSize': onPageSize,
      }
    })

    return {
      getFooterClass,
      getBindValues,
    }
  },
})
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

  &.center {
    justify-content: center;
  }

  .el-pagination {
    margin-top: 6px;
  }
}
</style>
