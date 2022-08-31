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
  // 自定义列的内容
  render?: (data: BasicTableColumnData) => VueNode
  // 自定义表头内容
  renderHeader?: (data: Omit<BasicTableColumnData, 'row'>) => VueNode
  // 插槽形式自定义列内容
  slot?: string
  // Header插槽形式自定义列头内容
  headerSlot?: string
  // 多级表头
  children?: TableColumn[]
}
