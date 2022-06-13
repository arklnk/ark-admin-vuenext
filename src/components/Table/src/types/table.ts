import type { TableProps } from 'element-plus/lib/components/table/src/table/defaults'
import type { PaginationProps } from './pagination'
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

export interface BasicTableProps<T = any> extends TableProps<T> {
  dataSource?: Recordable[]
  api?: (...arg: any[]) => Promise<any>
  beforeFetch?: Fn
  afterFetch?: Fn
  immediate?: boolean
  autoCreateKey?: boolean
  tableSetting?: TableSetting
  fetchSetting?: FetchSetting
  showTableSetting?: boolean
  pagination?: PaginationProps | boolean
  loading?: boolean
  clearSelectionOnPageChange?: boolean
}

export interface BasicTableActionType {
  reload: (opt?: FetchParams) => Promise<void>
  setLoading: (loading: boolean) => void
  setProps: (props: Partial<BasicTableProps>) => void
  setShowPagination: (show: boolean) => void
  getShowPagination: () => boolean
  getDataSource: <T = Recordable>() => T[]
  getSize: () => SizeType
}
