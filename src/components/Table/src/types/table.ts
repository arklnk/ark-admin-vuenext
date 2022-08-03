import type { basicProps } from '../props'
import type { ExtractPropTypes } from 'vue'
import type { SizeType } from '/#/config'

export interface TableSetting {
  redo?: boolean
  size?: boolean
  setting?: boolean
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
}

export type BasicTableProps = Partial<ExtractPropTypes<typeof basicProps>>

export type Key = string | number

export type GetRowKey<T = Recordable> = (record: T, index?: number) => Key

export interface TableRowSelection {
  selectedRowKeys?: Key[]
  // 多选 / 单选
  type?: 'checkbox' | 'radio'
  fixed?: boolean
  // 隐藏全选，多选下启用
  hideSelectAll?: boolean
  columnWidth?: string | number
  clearOnPageChange?: boolean
  align?: 'center' | 'left' | 'right'
  resizable?: boolean
  selectable?: (row: Recordable) => boolean
}

export interface BasicTableActionType {
  reload: (opt?: FetchParams) => Promise<void>
  setLoading: (loading: boolean) => void
  setProps: (props: Partial<BasicTableProps>) => void
  setShowPagination: (show: boolean) => void
  getShowPagination: () => boolean
  getDataSource: <T = Recordable>() => T[]
  getSize: () => SizeType
  redoHeight: () => void
}
