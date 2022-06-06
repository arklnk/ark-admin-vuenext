import type { TableColumnCtx } from 'element-plus/lib/components/table/src/table-column/defaults'
import type { TreeNode } from 'element-plus/lib/components/table/src/table/defaults'
import type { CSSProperties } from 'vue'
import type { PaginationProps } from './pagination'

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
export type TooltipType = 'dark' | 'light'

export interface BasicTableProps<T = any> {
  dataSource?: Recordable[]
  api?: (...arg: any[]) => Promise<any>
  immediate?: boolean
  clearSelectOnPageChange?: boolean
  tableSetting?: TableSetting
  showTableSetting?: boolean
  pagination?: PaginationProps
  loading?: boolean
  stripe?: boolean
  border?: boolean
  size?: SizeType
  fit?: boolean
  showHeader?: boolean
  highlightCurrentRow?: boolean
  currentRowKey?: string | number
  rowClassName?: string | ((data: TableRowRecord<T>) => string)
  rowStyle?: CSSProperties | ((data: TableRowRecord<T>) => CSSProperties)
  rowKey?: string | ((data: any) => string)
  emptyText?: string
  defaultExpandAll?: boolean
  expandRowKeys?: any[]
  defaultSort?: TableSorter
  tooltipEffect?: TooltipType
  showSummary?: boolean
  sumText?: string
  summaryMethod?: (data: TableSummaryRecord<any>) => string[]
  spanMethod?: (data: TableRowColumnRecord<any>) => number[] | { rowspan: number; colspan: number }
  selectOnIndeterminate?: boolean
  indent?: number
  lazy?: boolean
  load?: (row: any, treeNode: TreeNode, resolve: (data: any[]) => void) => void
  treeProps?: { hasChildren?: string | undefined; children?: string | undefined }
  tableLayout?: TableLayoutType
  scrollbarAlwaysOn?: boolean
  flexible?: boolean
}
