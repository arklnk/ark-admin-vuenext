import type columnProps from 'element-plus/es/components/table/src/table-column/defaults'
import type { ExtractPropTypes } from 'vue'

/**
 * table-column-props
 */
export interface BasicColumn extends Partial<ExtractPropTypes<typeof columnProps>> {
  // 多级表头
  children?: BasicColumn[]
}
