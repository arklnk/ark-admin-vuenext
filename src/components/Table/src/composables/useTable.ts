// import type { BasicTableProps } from '../types/table'
import type { BasicTableActionType, BasicTableProps, FetchParams } from '../types/table'

import { ref, onUnmounted, unref } from 'vue'
import { error } from '/@/utils/log'

type Register = (instance: BasicTableActionType) => void

export function useTable(): [Register, BasicTableActionType] {
  const tableRef = ref<Nullable<BasicTableActionType>>(null)
  const loadedRef = ref<Nullable<boolean>>(false)

  function register(instance: BasicTableActionType) {
    onUnmounted(() => {
      tableRef.value = null
      loadedRef.value = null
    })

    if (unref(loadedRef) && instance === unref(tableRef)) return

    tableRef.value = instance
    loadedRef.value = true
  }

  function getTableInstance(): BasicTableActionType {
    const table = unref(tableRef)
    if (!table) {
      error(
        'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!'
      )
    }

    return table as BasicTableActionType
  }

  const methods: BasicTableActionType = {
    reload: async (opt?: FetchParams) => {
      await getTableInstance().reload(opt)
    },
    setLoading: (loading: boolean) => {
      getTableInstance().setLoading(loading)
    },
    setProps: (props: Partial<BasicTableProps>) => {
      getTableInstance().setProps(props)
    },
    setShowPagination: (show: boolean) => {
      getTableInstance().setShowPagination(show)
    },
    getShowPagination: () => {
      return getTableInstance().getShowPagination()
    },
    getDataSource: () => {
      return getTableInstance().getDataSource()
    },
    getSize: () => {
      return getTableInstance().getSize()
    },
    redoHeight: () => {
      getTableInstance().redoHeight()
    },
  }

  return [register, methods]
}
