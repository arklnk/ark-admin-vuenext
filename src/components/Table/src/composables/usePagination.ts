import type { BasicTableProps } from '../types/table'
import type { ComputedRef } from 'vue'
import type { PaginationProps } from '../types/pagination'

import { ref, watch, unref, computed } from 'vue'
import { isBoolean } from 'lodash-es'
import { DEFAULT_PAGINATION } from '../const'

export function usePagination(props: ComputedRef<BasicTableProps>) {
  const configRef = ref<PaginationProps>({})
  const showRef = ref(true)

  watch(
    () => unref(props).pagination,
    (pagination) => {
      if (!isBoolean(pagination) && pagination) {
        configRef.value = {
          ...unref(configRef),
          ...(pagination || {}),
        }
      }
    }
  )

  const getPaginationInfo = computed((): PaginationProps | boolean => {
    const { pagination } = unref(props)

    if (!unref(showRef) || (isBoolean(pagination) && !pagination)) {
      return false
    }
    const info: PaginationProps = {
      total: 0,
      currentPage: 1,
      ...DEFAULT_PAGINATION,
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
    }

    // 检查pageSize属性是否存在于pageSizes中
    if (!info.pageSizes!.includes(info.pageSize!) && info.pageSizes!.length > 0) {
      info.pageSize = info.pageSizes![0]
    }

    return info
  })

  function setPagination(pagination: Partial<PaginationProps>) {
    const prev = unref(getPaginationInfo)

    configRef.value = {
      ...(!isBoolean(prev) ? prev : {}),
      ...pagination,
    }
  }

  function getPagination() {
    return unref(getPaginationInfo)
  }

  function setShowPagination(show: boolean) {
    showRef.value = show
  }

  const getShowPaginationRef = computed(() => {
    const pagination = getPagination()
    if (isBoolean(pagination) && !pagination) {
      return false
    }
    return unref(showRef)
  })

  function getShowPagination() {
    return unref(getShowPaginationRef)
  }

  return {
    setShowPagination,
    getShowPagination,
    getShowPaginationRef,

    setPagination,
    getPagination,
    getPaginationInfo,
  }
}
