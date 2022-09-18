import type { BasicTableProps } from '../types/table'
import type { ComputedRef } from 'vue'
import type { PaginationProps } from '../types/pagination'

import { ref, watch, unref, computed } from 'vue'
import { isBoolean } from 'lodash-es'
import { DEFAULT_PAGINATION } from '../const'

export function usePagination(getProps: ComputedRef<BasicTableProps>) {
  const configRef = ref<PaginationProps>({})
  const showRef = ref(true)

  watch(
    () => unref(getProps).pagination,
    (pagination) => {
      // check pagination props type, if is true or null will use default config
      // if false will disable pagination
      if (isBoolean(pagination) && !pagination) {
        showRef.value = false
      } else {
        configRef.value = {
          ...unref(configRef),
          ...(isBoolean(pagination) ? {} : pagination),
        }

        showRef.value = true
      }
    },
    {
      immediate: true,
      deep: true,
    }
  )

  const getPaginationRef = computed((): Nullable<PaginationProps> => {
    if (!unref(showRef)) {
      return
    }

    const info: PaginationProps = {
      total: 0,
      currentPage: 1,
      ...DEFAULT_PAGINATION,
      ...unref(configRef),
    }

    // 检查pageSize属性是否存在于pageSizes中
    if (!info.pageSizes!.includes(info.pageSize!) && info.pageSizes!.length > 0) {
      info.pageSize = info.pageSizes![0]
    }

    return info
  })

  function setPagination(pagination: Partial<PaginationProps>) {
    const prev = unref(configRef)

    configRef.value = {
      ...prev,
      ...pagination,
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

  return {
    setShowPagination,
    getShowPagination,

    setPagination,
    getPagination,
    getPaginationRef,
  }
}
