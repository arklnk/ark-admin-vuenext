import type { BasicColumn, BasicColumnData } from '../types/column'

import { defineComponent } from 'vue'
import { isEmpty, isFunction, omit } from 'lodash-es'
import { getSlot } from '/@/utils/helper/tsx'

export default defineComponent({
  name: 'BasicTableColumn',
  props: {
    columns: {
      type: Array as PropType<BasicColumn[]>,
      default: () => null,
    },
  },
  setup(props, { slots }) {
    function renderColumns(columns: BasicColumn[]) {
      return columns.map((col) => {
        const slotsObj: Recordable = {}

        // render content
        if (col.children && col.children.length > 0) {
          // multiple table header
          const childColumns = renderColumns(col.children)
          slotsObj.default = () => childColumns
        } else if (!isEmpty(col.slot)) {
          // slot 渲染默认内容
          slotsObj.default = (scope: BasicColumnData) => getSlot(slots, col.slot, scope)
        } else if (col.render && isFunction(col.render)) {
          // render function渲染默认内容
          slotsObj.default = (scope: BasicColumnData) => col.render!(scope)
        }

        // render header
        if (!isEmpty(col.headerSlot)) {
          slotsObj.header = (scope: Omit<BasicColumnData, 'row'>) =>
            getSlot(slots, col.headerSlot, scope)
        } else if (col.renderHeader && isFunction(col.renderHeader)) {
          slotsObj.header = (scope: Omit<BasicColumnData, 'row'>) => col.renderHeader!(scope)
        }

        const bindValue = omit(col, ['children', 'render', 'slot', 'renderHeader', 'headerSlot'])

        return <el-table-column v-slots={slotsObj} {...bindValue} />
      })
    }

    return () => {
      if (!props.columns) return null

      return renderColumns(props.columns)
    }
  },
})
