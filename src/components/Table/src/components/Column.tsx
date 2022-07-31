import type { BasicColumn } from '../types/column'

import { defineComponent } from 'vue'
import { omit } from 'lodash-es'

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
        // multiple table header
        const slots: Recordable = {}
        if (col.children && col.children.length > 0) {
          const childColumns = renderColumns(col.children)
          slots.default = () => childColumns
        }

        const bindValue = omit(col, 'children')
        return <el-table-column v-slots={slots} {...bindValue} />
      })
    }

    return () => {
      if (!props.columns) return null

      return renderColumns(props.columns)
    }
  },
})
