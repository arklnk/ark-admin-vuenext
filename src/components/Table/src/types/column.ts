import type columnProps from 'element-plus/es/components/table/src/table-column/defaults'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import type { ExtractPropTypes } from 'vue'

export type BasicTableColumnCtx<T = any> = TableColumnCtx<T>

export interface BasicTableColumnData<T = any> {
  row: T
  column: BasicTableColumnCtx<T>
  $index: number
}

/**
 * table-column-props
 */
export interface TableColumn
  extends Omit<Partial<ExtractPropTypes<typeof columnProps>>, 'renderHeader'> {
  // 对应列的类型，重写用于ts提示
  type?: 'selection' | 'index' | 'expand'
  // 对齐方式，重写用于ts提示
  align?: 'left' | 'right' | 'center'
  headerAlign?: 'left' | 'right' | 'center'
  // 固定列，重写用于ts提示
  fixed?: boolean | 'left' | 'right'
  // 自定义列的内容
  render?: (data: BasicTableColumnData) => VueNode
  // 自定义表头内容
  renderHeader?: (data: Omit<BasicTableColumnData, 'row'>) => VueNode
  // 插槽形式自定义列内容
  slot?: string
  // Header插槽形式自定义列头内容
  headerSlot?: string
  // 控制是否显示
  hidden?: boolean | ((column: TableColumn) => boolean)
  // 多级表头
  children?: TableColumn[]
}
