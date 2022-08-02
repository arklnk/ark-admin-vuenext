<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <!-- Table -->
    <ElTable ref="tableRef" v-loading="getLoading" v-bind="getBindValues">
      <!-- default slot -->
      <BasicTableColumn :columns="getColumnsRef" />
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </ElTable>
    <!-- Pagination -->
    <div ref="footerRef" v-if="getShowPaginationRef" :class="`${prefixCls}__footer`">
      <ElPagination
        v-bind="getPaginationRef"
        @update:current-page="handlePageChange"
        @update:page-size="handleSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { BasicTableActionType, BasicTableProps } from './types/table'
import type { SizeType } from '/#/config'

import { computed, defineComponent, ref, unref } from 'vue'
import { omit } from 'lodash-es'
import { useLoading } from './composables/useLoading'
import { basicProps } from './props'
import { usePagination } from './composables/usePagination'
import { useDataSource } from './composables/useDataSource'
import { useDesign } from '/@/composables/core/useDesign'
import { useRowSelection } from './composables/useRowSelection'
import { useColumns } from './composables/useColumns'
import { createTableContext } from './composables/useTableContext'
import BasicTableColumn from './components/Column'
import { useTableHeight } from './composables/useTableHeight'

export default defineComponent({
  name: 'BasicTable',
  components: {
    BasicTableColumn,
  },
  props: basicProps,
  emits: ['register', 'fetch-success', 'fetch-error', 'page-change', 'size-change'],
  setup(props, { emit, attrs, expose }) {
    const wrapRef = ref(null)
    const tableRef = ref(null)
    const footerRef = ref(null)

    const innerPropsRef = ref<Partial<BasicTableProps>>()
    const tableDataRef = ref<Recordable[]>([])

    const { prefixCls } = useDesign('basic-table')

    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as BasicTableProps
    })

    const { setLoading, getLoading } = useLoading(getProps)
    const {
      getPaginationRef,
      setPagination,
      getShowPagination,
      setShowPagination,
      getShowPaginationRef,
    } = usePagination(getProps)

    const { clearSelectedKeys } = useRowSelection(getProps, tableDataRef, emit)

    const {
      getDataSourceRef,
      getDataSource,
      handleTableChange: onTableChange,
      reload,
    } = useDataSource(
      getProps,
      { getPaginationRef, setPagination, setLoading, tableDataRef, clearSelectedKeys },
      emit
    )

    const { getColumnsRef } = useColumns(getProps)

    const { getTableHeight } = useTableHeight(getProps, tableRef, footerRef, wrapRef)

    const getBindValues = computed(() => {
      const data = unref(getDataSourceRef)
      let propsData: Recordable = {
        ...attrs,
        ...unref(getProps),
        ...(unref(getTableHeight) ? { height: unref(getTableHeight) } : {}),
        data,
      }

      propsData = omit(propsData, ['class'])

      return propsData
    })

    function handlePageChange(currentPage: number) {
      onTableChange({
        currentPage,
      })
      emit('page-change')
    }

    function handleSizeChange(size: number) {
      onTableChange({
        pageSize: size,
      })
      emit('size-change', size)
    }

    const getWrapperClass = computed(() => {
      return [prefixCls, attrs.class]
    })

    function setProps(props: Partial<BasicTableProps>) {
      innerPropsRef.value = { ...unref(innerPropsRef), ...props }
    }

    const tableAction: BasicTableActionType = {
      setLoading,
      setProps,
      setShowPagination,
      getShowPagination,
      reload,
      getDataSource,
      getSize: () => unref(getProps).size as SizeType,
    }

    createTableContext({ ...tableAction, wrapRef, tableRef, getBindValues })

    expose(tableAction)

    emit('register', tableAction)

    return {
      wrapRef,
      tableRef,
      footerRef,
      prefixCls,
      getWrapperClass,
      getBindValues,
      getPaginationRef,
      getShowPaginationRef,
      getColumnsRef,
      getLoading,
      handlePageChange,
      handleSizeChange,
    }
  },
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-basic-table;

.#{$prefixCls} {
  position: relative;

  &__footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: var(--el-table-bg-color);
    overflow: hidden;

    .el-pagination {
      margin: 8px 0;
    }
  }
}
</style>
