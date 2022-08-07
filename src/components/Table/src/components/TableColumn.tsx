import type { BasicColumn, TableColumnData } from '../types/column'

import { defineComponent } from 'vue'
import { isFunction, omit } from 'lodash-es'

export default defineComponent({
  name: 'BasicTableColumn',
  props: {
    columns: {
      type: Array as PropType<BasicColumn[]>,
      default: () => null,
    },
  },
  setup(props) {
    function renderColumns(columns: BasicColumn[]) {
      return columns.map((col) => {
        const slots: Recordable = {}
        if (col.children && col.children.length > 0) {
          // multiple table header
          const childColumns = renderColumns(col.children)
          slots.default = () => childColumns
        } else if (col.render && isFunction(col.render)) {
          // render function渲染默认内容（自定义内容需求）
          slots.default = (scope: TableColumnData) => col.render!(scope)
        }

        const bindValue = omit(col, ['children', 'render'])
        return <el-table-column v-slots={slots} {...bindValue} />
      })
    }

    return () => {
      if (!props.columns) return null

      return renderColumns(props.columns)
    }
  },
})
