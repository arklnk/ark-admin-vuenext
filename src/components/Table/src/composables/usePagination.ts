import type { BasicTableProps } from '../types/table'
import type { ComputedRef } from 'vue'
import type { PaginationProps } from '../types/pagination'

import { ref, watch, unref, computed } from 'vue'
import { isBoolean } from 'lodash-es'
import {
  DEFAULT_PAGE_BG,
  DEFAULT_PAGE_LAYOUT,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZES_OPTIONS,
  DEFAULT_PAGE_SMALL,
} from '../const'

export function usePagination(getProps: ComputedRef<BasicTableProps>) {
  const configRef = ref<PaginationProps>({})
  const showRef = ref(true)

  watch(
    () => unref(getProps).pagination,
    (pagination) => {
      // check pagination props type, if is true or null will use default config
      // if false will disable pagination
      showRef.value = !(isBoolean(pagination) && !pagination)
    },
    {
      immediate: true,
    }
  )

  const getPaginationRef = computed((): Nullable<PaginationProps> => {
    if (!unref(showRef)) return null

    const { pagination } = unref(getProps)

    return {
      total: 0,
      currentPage: 1,
      pageSizes: DEFAULT_PAGE_SIZES_OPTIONS,
      pageSize: DEFAULT_PAGE_SIZE,
      layout: DEFAULT_PAGE_LAYOUT,
      background: DEFAULT_PAGE_BG,
      small: DEFAULT_PAGE_SMALL,
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
    }
  })

  function setPagination(info: Partial<PaginationProps>) {
    const prev = unref(getPaginationRef)

    configRef.value = {
      ...prev,
      ...info,
    }
  }

  function getPagination() {
    return unref(getPaginationRef)
  }

  function setShowPagination(show: boolean) {
    showRef.value = show
  }

  function getShowPagination() {
    return unref(showRef)
  }

  const getShowPaginationRef = computed(() => {
    return unref(showRef)
  })

  return {
    setShowPagination,
    getShowPagination,
    getShowPaginationRef,

    setPagination,
    getPagination,
    getPaginationRef,
  }
}
