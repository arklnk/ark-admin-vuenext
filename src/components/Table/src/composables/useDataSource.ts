import type { ComputedRef, Ref } from 'vue'
import type { PaginationProps } from '../types/pagination'
import type { BasicTableProps, FetchParams } from '../types/table'

import { watch, unref, ref, onMounted, watchEffect, computed } from 'vue'
import { get, isFunction, merge } from 'lodash-es'
import { DEFAULT_PAGINATION, FETCH_SETTING } from '../const'

interface ActionType {
  getPaginationRef: ComputedRef<Nullable<PaginationProps>>
  setPagination: (info: Partial<PaginationProps>) => void
  setLoading: (loading: boolean) => void
  clearSelectedKeys: () => void
  tableDataRef: Ref<Recordable[]>
}

export function useDataSource(
  getProps: ComputedRef<BasicTableProps>,
  { setLoading, getPaginationRef, setPagination, tableDataRef, clearSelectedKeys }: ActionType,
  emit: EmitFn
) {
  const dataSourceRef = ref<Recordable[]>([])

  watch(
    () => unref(getProps).data,
    () => {
      const { data, api } = unref(getProps)
      if (!api && data) {
        dataSourceRef.value = data
      }
    },
    {
      immediate: true,
    }
  )

  watchEffect(() => {
    tableDataRef.value = unref(dataSourceRef)
  })

  function handleTableChange(pagination: Partial<PaginationProps>) {
    if (unref(getProps).rowSelection?.clearOnPageChange) {
      clearSelectedKeys()
    }

    setPagination(pagination)

    fetch()
  }

  const getDataSourceRef = computed(() => {
    return unref(dataSourceRef)
  })

  async function fetch(opt?: FetchParams) {
    const { api, fetchSetting, beforeFetch, afterFetch, searchInfo } = unref(getProps)

    if (!api || !isFunction(api)) return

    try {
      setLoading(true)

      const { pageField, sizeField, listField, totalField } = Object.assign(
        {},
        FETCH_SETTING,
        fetchSetting
      )

      const pageParams: Recordable = {}
      // set page params info
      if (unref(getPaginationRef)) {
        const { currentPage = 1, pageSize = DEFAULT_PAGINATION.pageSize } = unref(
          getPaginationRef
        ) as PaginationProps

        pageParams[pageField] = (opt && opt.page) || currentPage
        pageParams[sizeField] = pageSize
      }

      // merge params
      let apiParams: Recordable = merge(pageParams, searchInfo ?? {}, opt?.searchInfo ?? {})

      if (beforeFetch && isFunction(beforeFetch)) {
        apiParams = (await beforeFetch(apiParams)) || apiParams
      }

      const res = await api(apiParams)

      const isArrayResult = Array.isArray(res)

      let resultItems: Recordable[] = isArrayResult ? res : get(res, listField)
      const resultTotal: number = isArrayResult ? res.length : get(res, totalField)

      if (afterFetch && isFunction(afterFetch)) {
        resultItems = (await afterFetch(resultItems)) || resultItems
      }

      dataSourceRef.value = resultItems
      setPagination({
        total: resultTotal,
      })

      if (opt && opt.page) {
        setPagination({
          currentPage: opt.page || 1,
        })
      }

      emit('fetch-success', {
        items: resultItems,
        total: resultTotal,
      })
    } catch (error) {
      dataSourceRef.value = []
      setPagination({
        total: 0,
      })

      emit('fetch-error', error)
    } finally {
      setLoading(false)
    }
  }

  function getDataSource<T = Recordable>() {
    return dataSourceRef.value as T[]
  }

  async function reload(opt?: FetchParams) {
    return await fetch(opt)
  }

  onMounted(() => {
    unref(getProps).immediate && fetch()
  })

  return {
    getDataSourceRef,
    getDataSource,
    fetch,
    reload,
    handleTableChange,
  }
}
