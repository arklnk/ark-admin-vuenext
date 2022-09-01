import type { ComputedRef, Ref } from 'vue'
import type { BasicTableProps } from '../types/table'

import { ref, unref, watch, nextTick } from 'vue'
import { ElLoading } from 'element-plus'

export function useLoading(getProps: ComputedRef<BasicTableProps>, tableElRef: Ref<ComponentEl>) {
  const loadingRef = ref(unref(getProps).loading)
  let loadingInstance: ReturnType<typeof ElLoading['service']>

  function setLoading(loading: boolean) {
    loadingRef.value = loading
  }

  function getTableWrapper(): Nullable<HTMLElement> {
    const table = unref(tableElRef)
    if (!table) return

    const tableEl = table.$el
    return tableEl?.querySelector('.el-table__body-wrapper')
  }

  watch(
    () => unref(getProps).loading,
    (loading) => {
      loadingRef.value = loading
    }
  )

  watch(
    () => unref(loadingRef),
    (v) => {
      if (!v) {
        loadingInstance?.close()
      } else {
        nextTick(() => {
          const wrapper = getTableWrapper()
          wrapper &&
            (loadingInstance = ElLoading.service({
              target: wrapper,
            }))
        })
      }
    },
    {
      immediate: true,
    }
  )

  return { setLoading }
}
