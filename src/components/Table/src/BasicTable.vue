<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <!-- Table -->
    <div class="flex-1">
      <ElTable ref="tableElRef" v-loading="getLoading" v-bind="getBindValues">
        <slot></slot>
      </ElTable>
    </div>
    <!-- Pagination -->
    <div v-if="getShowPagination" class="flex justify-end">
      <ElPagination
        v-bind="getPagingBindValues"
        @update:current-page="handleCurrentPageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { BasicTableProps } from './types/table'
import type { PaginationProps } from './types/pagination'
import type { ElTable } from 'element-plus'

import { computed, defineComponent, ref, unref } from 'vue'
import { useLoading } from './composables/useLoading'
import { basicProps } from './props'
import { usePagination } from './composables/usePagination'
import { useDataSource } from './composables/useDataSource'
import { useDesign } from '/@/composables/core/useDesign'
import { isBoolean, omit } from 'lodash-es'

export default defineComponent({
  name: 'BasicTable',
  props: basicProps,
  emits: ['register', 'fetch-success', 'fetch-error', 'selection-change'],
  setup(props, { emit, attrs }) {
    const wrapRef = ref<HTMLDivElement>()
    const tableElRef = ref<InstanceType<typeof ElTable>>()

    const innerPropsRef = ref<Partial<BasicTableProps>>({})

    const { prefixCls } = useDesign('basic-table')

    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as BasicTableProps
    })

    const { setLoading, getLoading } = useLoading(getProps)
    const { getPaginationInfo, setPagination, getShowPagination } = usePagination(getProps)
    const { getDataSourceRef, handlePageChange: onPageChange } = useDataSource(
      getProps,
      { getPaginationInfo, setPagination, setLoading, clearSelectionRows: () => {} },
      emit
    )

    const getBindValues = computed(() => {
      const data = unref(getDataSourceRef)
      let propsData: Recordable = {
        ...unref(getProps),
        data,
      }

      propsData = omit(propsData, ['class', 'onSelectionChange'])

      return propsData
    })

    const getPagingBindValues = computed((): PaginationProps => {
      const pagination = unref(getPaginationInfo)
      if (isBoolean(pagination) && !pagination) {
        return {}
      }
      return pagination as PaginationProps
    })
    function handleCurrentPageChange(currentPage: number) {
      onPageChange({ currentPage })
    }
    function handlePageSizeChange(pageSize: number) {
      onPageChange({ pageSize })
    }

    const getWrapperClass = computed(() => {
      return [prefixCls, attrs.class]
    })

    emit('register')

    return {
      wrapRef,
      tableElRef,
      getWrapperClass,
      getBindValues,
      getPagingBindValues,
      getLoading,
      getShowPagination,
      handleCurrentPageChange,
      handlePageSizeChange,
    }
  },
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-basic-table;

.#{$prefixCls} {
  position: relative;
  display: flex;
  flex-direction: column;

  &__header {
    background-color: #707277;
  }

  .el-pagination {
    margin: 6px 0;
  }
}

html.dark {
  .#{$prefixCls} {
    &__header {
      background-color: #eceef3;
    }
  }
}
</style>
