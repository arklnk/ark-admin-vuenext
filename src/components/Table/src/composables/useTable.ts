import type {
  BasicTableActionType,
  BasicTableProps,
  FetchParams,
  GetColumnsParams,
} from '../types/table'
import type { WatchStopHandle } from 'vue'
import type { TableColumn } from '../types/column'

import { ref, onUnmounted, unref, watch } from 'vue'
import { error } from '/@/utils/log'
import { isProdMode } from '/@/utils/env'
import { toRefableProps } from '/@/utils'

type Props = Partial<RefableProps<BasicTableProps>>

type Register = (instance: BasicTableActionType) => void

export function useTable(tableProps?: Props): [Register, BasicTableActionType] {
  const tableRef = ref<Nullable<BasicTableActionType>>(null)
  const loadedRef = ref<Nullable<boolean>>(false)

  let stopWatch: WatchStopHandle

  function register(instance: BasicTableActionType) {
    if (isProdMode()) {
      onUnmounted(() => {
        tableRef.value = null
        loadedRef.value = null
      })
    }

    if (unref(loadedRef) && isProdMode() && instance === unref(tableRef)) return

    tableRef.value = instance
    loadedRef.value = true

    if (tableProps) {
      instance.setProps(toRefableProps(tableProps))
      stopWatch?.()

      stopWatch = watch(
        () => tableProps,
        () => {
          tableProps && instance.setProps(toRefableProps(tableProps))
        },
        {
          deep: true,
        }
      )
    }
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
    setCurrentRow: (row: Recordable) => {
      getTableInstance().setCurrentRow(row)
    },
    getCurrentRow: () => {
      return getTableInstance().getCurrentRow()
    },
    clearSelection: () => {
      getTableInstance().clearSelection()
    },
    getSelectionRows: () => {
      return getTableInstance().getSelectionRows()
    },
    toggleRowSelection: (row: Recordable, selected?: boolean) => {
      getTableInstance().toggleRowSelection(row, selected)
    },
    toggleAllSelection: () => {
      getTableInstance().toggleAllSelection()
    },
    setColumns: (columns: TableColumn[]) => {
      return getTableInstance().setColumns(columns)
    },
    getColumns: (params?: GetColumnsParams): TableColumn[] => {
      return getTableInstance().getColumns(params)
    },
  }

  return [register, methods]
}
