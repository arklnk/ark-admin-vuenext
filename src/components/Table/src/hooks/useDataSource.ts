import type { ComputedRef, Ref } from 'vue'
import type { PaginationProps } from '../types/pagination'
import type { BasicTableProps, FetchParams } from '../types/table'

import { watch, unref, ref, onMounted, computed } from 'vue'
import { get, isBoolean, isFunction } from 'lodash-es'
import { DEFAULT_PAGE_SIZE, FETCH_SETTING, ROW_KEY } from '../const'

interface DataSourceAction {
  getPaginationInfo: ComputedRef<boolean | PaginationProps>
  setPagination: (info: Partial<PaginationProps>) => void
  setLoading: (loading: boolean) => void
  tableData: Ref<Recordable[]>
}

export function useDataSource(
  props: ComputedRef<BasicTableProps>,
  action: DataSourceAction,
  emit: EmitFn
) {
  const { setLoading, getPaginationInfo, setPagination } = action

  const dataSourceRef = ref<Recordable[]>([])

  watch(
    () => unref(props).dataSource,
    () => {
      const { dataSource, api } = unref(props)
      if (!api && dataSource) {
        dataSourceRef.value = dataSource
      }
    },
    {
      immediate: true,
    }
  )

  const getAutoCreateKey = computed(() => {
    return unref(props).autoCreateKey && !unref(props).rowKey
  })

  const getRowKey = computed(() => {
    const { rowKey } = unref(props)
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey
  })

  async function fetch(opt?: FetchParams) {
    const { api, fetchSetting, pagination, beforeFetch, afterFetch } = unref(props)
    if (!api || !isFunction(api)) return

    try {
      setLoading(true)

      const { pageField, sizeField, listField, totalField } = Object.assign(
        {},
        FETCH_SETTING,
        fetchSetting
      )

      const pageParams: Recordable = {}

      const { currentPage = 1, pageSize = DEFAULT_PAGE_SIZE } = unref(
        getPaginationInfo
      ) as PaginationProps

      if (isBoolean(pagination) && !pagination) {
        pageParams[pageField] = (opt && opt.page) || currentPage
        pageParams[sizeField] = pageSize
      }

      let apiParams: Recordable = {
        ...pageParams,
        ...(opt?.searchInfo || {}),
      }

      if (beforeFetch && isFunction(beforeFetch)) {
        apiParams = (await beforeFetch(apiParams)) || apiParams
      }

      const res = await api(apiParams)

      const isArrayResult = Array.isArray(res)

      let resultItems: Recordable[] = isArrayResult ? res : get(res, listField)
      const resultTotal: number = isArrayResult ? 0 : get(res, totalField)

      if (afterFetch && isFunction(afterFetch)) {
        resultItems = (await afterFetch(resultItems)) || resultItems
      }

      dataSourceRef.value = resultItems
      setPagination({
        total: resultTotal,
      })

      if (opt && opt.page) {
        setPagination({
          currentPage: opt.page,
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

  async function reload(opt?: FetchParams) {
    return await fetch(opt)
  }

  onMounted(() => {
    unref(props).immediate && fetch()
  })

  return {
    fetch,
    reload,

    getAutoCreateKey,
    getRowKey,
  }
}
