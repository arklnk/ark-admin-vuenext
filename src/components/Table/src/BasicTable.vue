<template>
  <div></div>
</template>

<script lang="ts">
import type { BasicTableProps } from './types/table'

import { computed, defineComponent, ref, unref } from 'vue'
import { useLoading } from './hooks/useLoading'
import { basicProps } from './props'
import { usePagination } from './hooks/usePagination'
import { useDataSource } from './hooks/useDataSource'

export default defineComponent({
  name: 'BasicTable',
  props: basicProps,
  emits: ['register', 'fetch-success', 'fetch-error'],
  setup(props, { emit }) {
    const innerPropsRef = ref<Partial<BasicTableProps>>({})

    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) } as BasicTableProps
    })

    const { setLoading, getLoading } = useLoading(getProps)

    const { getPaginationInfo, setPagination } = usePagination(getProps)

    const { getDataSourceRef } = useDataSource(
      getProps,
      { getPaginationInfo, setPagination, setLoading, clearSelectedRowKeys: () => {} },
      emit
    )

    const getTableProps = computed(() => {
      const data = unref(getDataSourceRef)

      return {
        data,
      }
    })

    emit('register')

    return {
      getTableProps,
      getLoading,
    }
  },
})
</script>
