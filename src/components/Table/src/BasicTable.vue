<template>
  <div ref="wrapRef" :class="prefixCls">
    <ElTable ref="tableElRef" v-loading="getLoading">
      <slot></slot>
    </ElTable>
  </div>
</template>

<script lang="ts">
import type { BasicTableProps } from './types/table'

import { computed, defineComponent, ref, unref } from 'vue'
import { useLoading } from './hooks/useLoading'
import { basicProps } from './props'
import { usePagination } from './hooks/usePagination'
import { useDataSource } from './hooks/useDataSource'
import { useDesign } from '/@/hooks/core/useDesign'

export default defineComponent({
  name: 'BasicTable',
  props: basicProps,
  emits: ['register', 'fetch-success', 'fetch-error'],
  setup(props, { emit }) {
    const wrapRef = ref(null)
    const tableElRef = ref(null)

    const innerPropsRef = ref<Partial<BasicTableProps>>({})

    const { prefixCls } = useDesign('basic-table')

    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as BasicTableProps
    })

    const { setLoading, getLoading } = useLoading(getProps)
    const { getPaginationInfo, setPagination, getShowPagination } = usePagination(getProps)
    const { getDataSourceRef } = useDataSource(
      getProps,
      { getPaginationInfo, setPagination, setLoading },
      emit
    )
    const getTableBindValues = computed(() => {
      const data = unref(getDataSourceRef)

      return {
        ...unref(getProps),
        data,
      }
    })
    const getPaginationBindValues = computed(() => {
      return {}
    })

    emit('register')

    return {
      prefixCls,
      wrapRef,
      tableElRef,
      getTableBindValues,
      getPaginationBindValues,
      getLoading,
      getShowPagination,
    }
  },
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-basic-table;

.#{$prefixCls} {
  position: relative;
}
</style>
