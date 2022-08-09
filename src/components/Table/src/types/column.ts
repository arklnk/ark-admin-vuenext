import type columnProps from 'element-plus/es/components/table/src/table-column/defaults'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import type { ExtractPropTypes, VNode } from 'vue'

export type BasicColumnCtx<T = any> = TableColumnCtx<T>

export interface BasicColumnData<T = any> {
  row: T
  column: BasicColumnCtx<T>
  $index: number
}

/**
 * table-column-props
 */
export interface BasicColumn extends Partial<ExtractPropTypes<typeof columnProps>> {
  // 自定义列的内容
  render?: (data: BasicColumnData) => VNode
  // 插槽形式自定义列内容
  slot?: string
  // 多级表头
  children?: BasicColumn[]
}
