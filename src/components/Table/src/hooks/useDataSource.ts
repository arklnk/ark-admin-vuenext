import type { ComputedRef, Ref } from 'vue'
import type { PaginationProps } from '../types/pagination'
import type { BasicTableProps, FetchParams } from '../types/table'

import { watch, unref, ref, onMounted } from 'vue'
import { get, isBoolean, isFunction } from 'lodash-es'

import componentSetting from '/@/settings/componentSetting'

const {
  table: { fetchSetting: FETCH_SETTING },
} = componentSetting

interface DataSourceAction {
  getPaginationInfo: ComputedRef<boolean | PaginationProps>
  setPagination: (info: Partial<PaginationProps>) => void
  setLoading: (loading: boolean) => void
  tableData: Ref<Recordable[]>
}

export function useDataSource(props: ComputedRef<BasicTableProps>, action: DataSourceAction) {
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

  async function fetch(opt?: FetchParams) {
    const { api, fetchSetting, pagination } = unref(props)
    if (!api || !isFunction(api)) return

    try {
      setLoading(true)

      const { pageField, sizeField, listField, totalField } = Object.assign(
        {},
        FETCH_SETTING,
        fetchSetting
      )

      const pageParams: Recordable = {}

      const { currentPage = 1, pageSize = -1 } = unref(getPaginationInfo) as PaginationProps

      if (isBoolean(pagination) && !pagination) {
        pageParams[pageField] = (opt && opt.page) || currentPage
        pageParams[sizeField] = pageSize
      }

      const apiParams: Recordable = {
        ...pageParams,
        ...(opt?.searchInfo || {}),
      }

      const res = await api(apiParams)

      const isArrayResult = Array.isArray(res)

      const resultItems: Recordable[] = isArrayResult ? res : get(res, listField)
      const resultTotal: number = isArrayResult ? 0 : get(res, totalField)

      dataSourceRef.value = resultItems
      setPagination({
        total: resultTotal,
      })

      if (opt && opt.page) {
        setPagination({
          currentPage: opt.page,
        })
      }
    } catch (error) {
      dataSourceRef.value = []
      setPagination({
        total: 0,
      })
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
  }
}
