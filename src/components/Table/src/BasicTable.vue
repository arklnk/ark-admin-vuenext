<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <!-- Table -->
    <div class="flex-1">
      <ElTable ref="tableRef" v-loading="getLoading" v-bind="getBindValues">
        <!-- selection -->
        <ElTableColumn :resizable="false" :width="50" align="center">
          <template #default="{ row }">
            <ElCheckbox v-bind="getCheckboxProps(row)" />
          </template>
        </ElTableColumn>
        <!-- default slot -->
        <slot></slot>
      </ElTable>
    </div>
    <!-- Pagination -->
    <div v-if="getShowPagination()" class="flex justify-end">
      <ElPagination
        v-bind="getPagingProps"
        @update:current-page="(currentPage: number) => handleTableChange('currentPage', currentPage)"
        @update:page-size="(pageSize: number) => handleTableChange('pageSize', pageSize)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { BasicTableActionType, BasicTableProps } from './types/table'
import type { PaginationProps } from './types/pagination'
import type { SizeType } from '/#/config'

import { computed, defineComponent, ref, unref } from 'vue'
import { isBoolean, omit } from 'lodash-es'
import { useLoading } from './composables/useLoading'
import { basicProps } from './props'
import { usePagination } from './composables/usePagination'
import { useDataSource } from './composables/useDataSource'
import { useDesign } from '/@/composables/core/useDesign'
import { createTableContext } from './composables/useTableContext'
import { useRowSelection } from './composables/useRowSelection'

export default defineComponent({
  name: 'BasicTable',
  props: basicProps,
  emits: ['register', 'fetch-success', 'fetch-error', 'change'],
  setup(props, { emit, attrs, expose }) {
    const wrapRef = ref(null)
    const tableRef = ref(null)

    const innerPropsRef = ref<Partial<BasicTableProps>>()
    const tableDataRef = ref<Recordable[]>([])

    const { prefixCls } = useDesign('basic-table')

    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as BasicTableProps
    })

    const { setLoading, getLoading } = useLoading(getProps)
    const { getPaginationInfo, setPagination, getShowPagination, setShowPagination } =
      usePagination(getProps)

    const { getCheckboxProps, clearSelectedKeys } = useRowSelection(getProps, tableDataRef, emit)

    const {
      getDataSourceRef,
      getDataSource,
      handleTableChange: onTableChange,
      reload,
    } = useDataSource(
      getProps,
      { getPaginationInfo, setPagination, setLoading, tableDataRef, clearSelectedKeys },
      emit
    )

    const getBindValues = computed(() => {
      const data = unref(getDataSourceRef)
      let propsData: Recordable = {
        ...unref(getProps),
        data,
      }

      propsData = omit(propsData, ['class'])

      return propsData
    })

    const getPagingProps = computed((): PaginationProps => {
      const pagination = unref(getPaginationInfo)
      if (isBoolean(pagination) && !pagination) {
        return {}
      }
      return pagination as PaginationProps
    })
    function handleTableChange(type: string, val: number) {
      const args = {
        [type]: val,
      }
      onTableChange(args)
      emit('change', args)
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
      getWrapperClass,
      getBindValues,
      getPagingProps,
      getLoading,
      getShowPagination,
      handleTableChange,
      getCheckboxProps,
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
