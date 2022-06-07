import type { BasicTableProps } from '../types/table'
import type { ComputedRef } from 'vue'
import type { PaginationProps } from '../types/pagination'

import { ref, watch, unref, computed } from 'vue'
import { isBoolean } from 'lodash-es'
import { DEFAULT_LAYOUT, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZES } from '../const'

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

    return {
      currentPage: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      pageSizes: DEFAULT_PAGE_SIZES,
      layout: DEFAULT_LAYOUT,
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
    }
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

  function getShowPagination() {
    return unref(showRef)
  }

  return {
    setShowPagination,
    getShowPagination,

    setPagination,
    getPagination,
    getPaginationInfo,
  }
}
