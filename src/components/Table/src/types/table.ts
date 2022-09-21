import type { basicProps } from '../props'
import type { ExtractPropTypes } from 'vue'
import type { SizeType } from '/#/config'
import type { TableColumn } from './column'
import type { PaginationProps } from './pagination'

export interface TableSetting {
  redo?: boolean
  size?: boolean
  fullscreen?: boolean
}

export interface FetchSetting {
  // 请求接口当前页数
  pageField: string
  // 每页显示数量
  sizeField: string
  // 请求结果列表字段  支持 a.b.c
  listField: string
  // 请求结果总数字段  支持 a.b.c
  totalField: string
}

export interface FetchParams {
  page?: number
  searchInfo?: Recordable
}

export type BasicTableProps = Partial<ExtractPropTypes<typeof basicProps>>

export type Key = string | number

export type GetRowKey = (record: Recordable, index?: number) => Key

export interface GetColumnsParams {
  ignoreIndex?: boolean
  ignoreSelection?: boolean
  ignoreExpand?: boolean
}

export interface BasicTableActionType {
  reload: (opt?: FetchParams) => Promise<void>
  setLoading: (loading: boolean) => void
  setProps: (props: Partial<BasicTableProps>) => void
  setShowPagination: (show: boolean) => void
  getShowPagination: () => boolean
  getPagination: () => Nullable<PaginationProps>
  getDataSource: <T = Recordable>() => T[]
  getSize: () => SizeType
  redoHeight: () => void
  setCurrentRow: (row: Recordable) => void
  getCurrentRow: () => Nullable<Recordable>
  clearSelection: () => void
  getSelectionRows: <T = Recordable>() => T[]
  toggleRowSelection: (row: Recordable, selected?: boolean) => void
  toggleAllSelection: () => void
  toggleRowExpansion: (row: Recordable, expanded?: boolean) => void
  setColumns: (columns: TableColumn[]) => void
  getColumns: (params?: GetColumnsParams) => TableColumn[]
}
