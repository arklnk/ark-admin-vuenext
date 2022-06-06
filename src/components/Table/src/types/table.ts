import { TableColumnCtx } from 'element-plus/lib/components/table/src/table-column/defaults'

export interface TableRowRecord<T> {
  row: T
  rowIndex: number
}

export interface TableRowColumnRecord<T = any> extends TableRowRecord<T> {
  column: TableColumnCtx<T>
  columnIndex: number
}

export interface TableSorter {
  prop: string
  order: 'ascending' | 'descending'
}

export interface TableSummaryRecord<T> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

export interface TableSetting {
  redo?: boolean
  size?: boolean
  setting?: boolean
  fullScreen?: boolean
}

export interface FetchSetting {
  // 请求接口当前页数 支持 a.b.c
  pageField: string
  // 每页显示多少条 支持 a.b.c
  sizeField: string
  // 请求结果列表字段  支持 a.b.c
  listField: string
  // 请求结果总数字段  支持 a.b.c
  totalField: string
}

export type SizeType = 'default' | 'small' | 'large'
export type TableLayoutType = 'fixed' | 'auto'
