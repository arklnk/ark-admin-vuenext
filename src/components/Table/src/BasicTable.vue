<template>
  <div ref="wrapRef" v-loading="getLoading" :class="getWrapperClass">
    <!-- header -->
    <BasicTableHeader ref="headerRef" v-if="getShowTableHeader" v-bind="getHeaderBindValues">
      <template #[item]="data" v-for="item in Object.keys(pick($slots, ['headerTop', 'toolbar']))">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </BasicTableHeader>

    <!-- table -->
    <ElTable ref="tableRef" v-bind="getBindValues">
      <!-- column -->
      <BasicTableColumn :columns="getViewColumnsRef">
        <template
          #[item]="data"
          v-for="item in Object.keys(omit($slots, ['headerTop', 'toolbar', 'append', 'empty']))"
        >
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </BasicTableColumn>

      <!-- append and empty slot -->
      <template #[item]="data" v-for="item in Object.keys(pick($slots, ['append', 'empty']))">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </ElTable>

    <!-- footer -->
    <BasicTableFooter
      ref="footerRef"
      v-if="getShowPaginationRef"
      :pagination="getPaginationRef"
      @current-page="handlePageChange"
      @page-size="handleSizeChange"
    />
  </div>
</template>

<script lang="ts">
import type { BasicTableActionType, BasicTableProps, GetRowKey } from './types/table'
import type { SizeType } from '/#/config'

import { computed, defineComponent, ref, unref } from 'vue'
import { omit, pick } from 'lodash-es'
import { useLoading } from './composables/useLoading'
import { basicProps } from './props'
import { usePagination } from './composables/usePagination'
import { useDataSource } from './composables/useDataSource'
import { useDesign } from '/@/composables/core/useDesign'
import { useColumns } from './composables/useColumns'
import { createTableContext } from './composables/useTableContext'
import { useTableHeight } from './composables/useTableHeight'
import BasicTableColumn from './components/TableColumn'
import BasicTableHeader from './components/TableHeader.vue'
import BasicTableFooter from './components/TableFooter.vue'
import { useTableEvents } from './composables/useTableEvents'
import { useCurrentRow } from './composables/useCurrentRow'
import { warn } from '/@/utils/log'
import { useRowSelection } from './composables/useRowSelection'
import { useTableExpand } from './composables/useTableExpand'

export default defineComponent({
  name: 'BasicTable',
  components: {
    BasicTableColumn,
    BasicTableHeader,
    BasicTableFooter,
  },
  props: basicProps,
  emits: [
    'register',
    'fetch-success',
    'fetch-error',
    'page-change',
    'size-change',
    'select',
    'select-all',
    'selection-change',
    'cell-mouse-enter',
    'cell-mouse-leave',
    'cell-contextmenu',
    'cell-click',
    'cell-dblclick',
    'row-click',
    'row-contextmenu',
    'row-dblclick',
    'header-click',
    'header-contextmenu',
    'sort-change',
    'filter-change',
    'current-change',
    'header-dragend',
    'expand-change',
  ],
  setup(props, { emit, attrs, expose, slots }) {
    const wrapRef = ref()
    const headerRef = ref()
    const tableRef = ref()
    const footerRef = ref()

    const innerPropsRef = ref<Partial<BasicTableProps>>()

    const { prefixCls } = useDesign('basic-table')

    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as BasicTableProps
    })

    const getRowKey = computed((): GetRowKey | string | undefined => {
      const rowKey = unref(getProps).rowKey
      if (!rowKey) {
        warn('BasicTable rowKey prop not specify')
      }

      return rowKey
    })

    const {
      getPaginationRef,
      setPagination,
      getShowPagination,
      setShowPagination,
      getPagination,
      getShowPaginationRef,
    } = usePagination(getProps)

    const { getViewColumnsRef, setColumns, getColumns } = useColumns(getProps, getPagination)

    const { setLoading, getLoading } = useLoading(getProps)

    const {
      getDataSourceRef,
      getDataSource,
      handleTableChange: onTableChange,
      reload,
    } = useDataSource(getProps, { getPagination, setPagination, setLoading }, emit)

    const { getTableHeight, redoHeight } = useTableHeight(
      getProps,
      tableRef,
      footerRef,
      headerRef,
      wrapRef
    )

    const { setCurrentRowRef, setCurrentRow, getCurrentRow } = useCurrentRow(tableRef)

    const { clearSelection, getSelectionRows, toggleRowSelection, toggleAllSelection } =
      useRowSelection(tableRef)

    const { handleRowClickToggleExpand, toggleRowExpansion } = useTableExpand(getProps, tableRef)

    const { onTableEvent } = useTableEvents(emit, { setCurrentRowRef, handleRowClickToggleExpand })

    const getBindValues = computed((): Recordable => {
      const data = unref(getDataSourceRef)

      return {
        ...unref(getProps),
        ...(unref(getTableHeight) ? { height: unref(getTableHeight) } : {}),
        ...onTableEvent,
        rowKey: unref(getRowKey),
        data,
      }
    })

    const getHeaderBindValues = computed(() => {
      const props = unref(getProps)
      return {
        showTableSetting: props.showTableSetting,
        tableSetting: props.tableSetting,
      }
    })

    // headerTop toolbar插槽均不存在或不显示表格设置时则隐藏header
    const getShowTableHeader = computed((): boolean => {
      if (unref(getProps).showTableSetting) return true

      return !!slots['headerTop'] || !!slots['toolbar']
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
      return [
        prefixCls,
        attrs.class,
        {
          inset: unref(getProps).inset,
        },
      ]
    })

    function setProps(props: Partial<BasicTableProps>) {
      innerPropsRef.value = { ...unref(innerPropsRef), ...props }
    }

    const tableAction: BasicTableActionType = {
      setLoading,
      setProps,
      setShowPagination,
      getShowPagination,
      getPagination,
      reload,
      getDataSource,
      getSize: () => unref(getProps).size as SizeType,
      redoHeight,
      setCurrentRow,
      getCurrentRow,
      setColumns,
      getColumns,
      clearSelection,
      getSelectionRows,
      toggleRowSelection,
      toggleAllSelection,
      toggleRowExpansion,
    }

    createTableContext({ ...tableAction, wrapRef, tableRef, getBindValues })

    expose(tableAction)

    emit('register', tableAction)

    return {
      wrapRef,
      tableRef,
      footerRef,
      headerRef,
      prefixCls,
      getWrapperClass,
      getBindValues,
      getHeaderBindValues,
      getShowTableHeader,
      getPaginationRef,
      getShowPaginationRef,
      getViewColumnsRef,
      getLoading,
      omit,
      pick,
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
  max-width: 100%;
  padding: 6px;
  position: relative;
  background-color: var(--el-fill-color-blank);

  // fix mask over header in fiexd mode
  .el-table {
    --el-table-header-bg-color: var(--el-fill-color-light);

    .el-loading-mask {
      z-index: 8;
    }

    // remove not border mode appear bottom border
    &:not(.el-table--border) {
      .el-table__inner-wrapper {
        &::before {
          content: none;
        }
      }
    }
  }

  &.inset {
    padding: 0;
  }
}

html.dark {
  .#{$prefixCls} {
    .el-table {
      --el-table-header-bg-color: var(--el-bg-color);
    }
  }
}
</style>
