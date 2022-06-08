import type { ComputedRef } from 'vue'
import type { PaginationProps } from '../types/pagination'
import type { BasicTableProps } from '../types/table'

import { watch, unref, ref, onMounted, computed } from 'vue'
import { cloneDeep, get, isBoolean, isFunction } from 'lodash-es'
import { DEFAULT_PAGE_SIZE, FETCH_SETTING, ROW_KEY } from '../const'
import { buildUUID } from '/@/utils/uuid'

interface DataSourceAction {
  getPaginationInfo: ComputedRef<boolean | PaginationProps>
  setPagination: (info: Partial<PaginationProps>) => void
  setLoading: (loading: boolean) => void
  clearSelectedRowKeys: () => void
}

export function useDataSource(
  props: ComputedRef<BasicTableProps>,
  action: DataSourceAction,
  emit: EmitFn
) {
  const { setLoading, getPaginationInfo, setPagination, clearSelectedRowKeys } = action

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

  function handleTableChange(pagination: PaginationProps) {
    const { clearSelectOnPageChange } = unref(props)
    if (clearSelectOnPageChange) {
      clearSelectedRowKeys()
    }
    setPagination(pagination)
    fetch()
  }

  function setTableKey(items: any[]) {
    if (!items || !Array.isArray(items)) return
    const childrenKeyName = unref(getChildrenKey)

    items.forEach((item) => {
      if (!item[ROW_KEY]) {
        item[ROW_KEY] = buildUUID()
      }

      // tree
      if (item[childrenKeyName] && item[childrenKeyName].length) {
        setTableKey(item[childrenKeyName])
      }
    })
  }

  const getChildrenKey = computed(() => {
    return unref(props).treeProps?.children || 'children'
  })

  const getAutoCreateKey = computed(() => {
    return unref(props).autoCreateKey && !unref(props).rowKey
  })

  const getRowKey = computed(() => {
    const { rowKey } = unref(props)
    return unref(getAutoCreateKey) ? ROW_KEY : rowKey
  })

  const getDataSourceRef = computed((): Recordable[] => {
    const dataSource = unref(dataSourceRef)
    const childrenKeyName = unref(getChildrenKey)

    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef)
    }
    if (unref(getAutoCreateKey)) {
      const first = dataSource[0]
      const last = dataSource[dataSource.length - 1]

      if (first && last) {
        if (!first[ROW_KEY] && !last[ROW_KEY]) {
          const cloneData = cloneDeep(dataSource)
          cloneData.forEach((item) => {
            if (!item[ROW_KEY]) {
              item[ROW_KEY] = buildUUID()
            }

            if (item[childrenKeyName] && item[childrenKeyName].length) {
              setTableKey(item[childrenKeyName])
            }
          })

          dataSourceRef.value = cloneData
        }
      }
    }

    return unref(dataSourceRef)
  })

  async function fetch() {
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
        pageParams[pageField] = currentPage
        pageParams[sizeField] = pageSize
      }

      let apiParams: Recordable = {
        ...pageParams,
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

  async function reload() {
    return await fetch()
  }

  onMounted(() => {
    unref(props).immediate && fetch()
  })

  return {
    getDataSourceRef,
    getDataSource,
    getAutoCreateKey,
    getRowKey,

    fetch,
    reload,

    handleTableChange,
  }
}
