<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <!-- header -->
    <BasicTableHeader ref="headerRef" v-if="getShowTableHeader" v-bind="getHeaderBindValues">
      <template #[item]="data" v-for="item in ['headerTop', 'toolbar']">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </BasicTableHeader>

    <!-- table -->
    <ElTable ref="tableRef" v-loading="getLoading" v-bind="getBindValues">
      <!-- column -->
      <BasicTableColumn :columns="getColumnsRef" />

      <!-- slot -->
      <template #[item]="data" v-for="item in Object.keys(omit($slots, ['headerTop', 'toolbar']))">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </ElTable>

    <!-- footer -->
    <BasicTableFooter
      ref="footerRef"
      v-if="getShowPaginationRef"
      :pagination="getPaginationRef!"
      @current-page="handlePageChange"
      @page-size="handleSizeChange"
    />
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
import { useTableHeight } from './composables/useTableHeight'
import BasicTableColumn from './components/TableColumn'
import BasicTableHeader from './components/TableHeader.vue'
import BasicTableFooter from './components/TableFooter.vue'

export default defineComponent({
  name: 'BasicTable',
  components: {
    BasicTableColumn,
    BasicTableHeader,
    BasicTableFooter,
  },
  props: basicProps,
  emits: ['register', 'fetch-success', 'fetch-error', 'page-change', 'size-change'],
  setup(props, { emit, attrs, expose, slots }) {
    const wrapRef = ref()
    const headerRef = ref()
    const tableRef = ref()
    const footerRef = ref()

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

    const { getTableHeight, redoHeight } = useTableHeight(
      getProps,
      tableRef,
      footerRef,
      headerRef,
      wrapRef
    )

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
      redoHeight,
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
      getColumnsRef,
      getLoading,
      omit,
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
  position: relative;
  background-color: var(--el-fill-color-blank);
}
</style>
