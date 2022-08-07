import type columnProps from 'element-plus/es/components/table/src/table-column/defaults'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import type { ExtractPropTypes, VNode } from 'vue'

export interface TableColumnData<T = any> {
  row: T
  column: TableColumnCtx<T>
  $index: number
}

/**
 * table-column-props
 */
export interface BasicColumn extends Partial<ExtractPropTypes<typeof columnProps>> {
  // 自定义列的内容
  render?: (data: TableColumnData) => VNode
  // 多级表头
  children?: BasicColumn[]
}
