import type { ComputedRef } from 'vue'
import type { PaginationProps } from '../types/pagination'
import type { BasicTableProps, FetchParams } from '../types/table'

import { watch, unref, ref, onMounted, computed } from 'vue'
import { get, isBoolean, isFunction, merge } from 'lodash-es'
import { FETCH_SETTING, DEFAULT_PAGE_SIZE } from '../const'

interface ActionType {
  getPagination: () => Nullable<PaginationProps>
  setPagination: (info: Partial<PaginationProps>) => void
  setLoading: (loading: boolean) => void
}

export function useDataSource(
  getProps: ComputedRef<BasicTableProps>,
  { setLoading, getPagination, setPagination }: ActionType,
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

  function handleTableChange(pagination: Partial<PaginationProps>) {
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
      const pagination = getPagination()
      if (pagination) {
        const { currentPage = 1, pageSize = DEFAULT_PAGE_SIZE } = pagination

        pageParams[pageField] = (opt && opt.page) || currentPage
        pageParams[sizeField] = pageSize
      }

      // merge params
      let apiParams: Recordable = merge(pageParams, searchInfo ?? {}, opt?.searchInfo ?? {})

      if (beforeFetch && isFunction(beforeFetch)) {
        const beforeFetchResult = await beforeFetch(apiParams)
        // if false is returned then the request will not be processed
        if (isBoolean(beforeFetchResult) && !beforeFetchResult) return

        apiParams = isBoolean(beforeFetchResult) ? apiParams : beforeFetchResult || apiParams
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
    return getDataSourceRef.value as T[]
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
