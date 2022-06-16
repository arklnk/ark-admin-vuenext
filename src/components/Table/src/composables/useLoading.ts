import type { ComputedRef } from 'vue'
import type { BasicTableProps } from '../types/table'

import { ref, unref, watch, computed } from 'vue'

export function useLoading(getProps: ComputedRef<BasicTableProps>) {
  const loadingRef = ref(unref(getProps).loading)

  watch(
    () => unref(getProps).loading,
    (loading) => {
      loadingRef.value = loading
    }
  )

  const getLoading = computed(() => unref(loadingRef))

  function setLoading(loading: boolean) {
    loadingRef.value = loading
  }

  return { getLoading, setLoading }
}
