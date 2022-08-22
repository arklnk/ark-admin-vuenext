import type columnProps from 'element-plus/es/components/table/src/table-column/defaults'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import type { ExtractPropTypes } from 'vue'

export type BasicColumnCtx<T = any> = TableColumnCtx<T>

export interface BasicColumnData<T = any> {
  row: T
  column: BasicColumnCtx<T>
  $index: number
}

/**
 * table-column-props
 */
export interface BasicColumn
  extends Omit<Partial<ExtractPropTypes<typeof columnProps>>, 'renderHeader'> {
  // 自定义列的内容
  render?: (data: BasicColumnData) => VueNode
  // 自定义表头内容
  renderHeader?: (data: Omit<BasicColumnData, 'row'>) => VueNode
  // 插槽形式自定义列内容
  slot?: string
  // Header插槽形式自定义列头内容
  headerSlot?: string
  // 多级表头
  children?: BasicColumn[]
}
