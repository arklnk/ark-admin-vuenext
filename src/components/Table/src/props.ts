import type { TreeNode } from 'element-plus/lib/components/table/src/table/defaults'
import type { PropType, CSSProperties } from 'vue'
import { PaginationProps } from './types/pagination'
import type {
  SizeType,
  TableRowRecord,
  TableRowColumnRecord,
  TableSetting,
  TableSorter,
  TableSummaryRecord,
  TableLayoutType,
} from './types/table'

/**
 * 二次封装表格，由于需要TS只能提示，需要手动编写原ElTable的props
 * node_modules/element-plus/es/components/table/index.d.ts
 *
 * https://element-plus.org/zh-CN/component/table.html
 */
export const basicTableProps = {
  /**
   * 表格数据源
   */
  dataSource: {
    type: Array as PropType<any[]>,
    default: null,
  },
  /**
   * 表格数据api请求
   */
  api: {
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
    default: null,
  },
  /**
   * 是否立即执行api请求
   */
  immediate: {
    type: Boolean,
    default: true,
  },
  /**
   * 切换页面时清空选择
   */
  clearSelectOnPageChange: {
    type: Boolean,
    default: false,
  },
  /**
   * 显示需要的表格设置
   */
  tableSetting: {
    type: Object as PropType<TableSetting>,
    default: () => {},
  },
  /**
   * 是否需要显示表格设置
   */
  showTableSetting: {
    type: Boolean,
    default: true,
  },
  /**
   * 分页功能
   */
  pagination: {
    type: Object as PropType<PaginationProps>,
  },
  /**
   * 表格loading加载
   */
  loading: {
    type: Boolean,
    default: false,
  },
  //----- ElTable原有的属性
  /**
   * 是否为斑马纹 table
   */
  stripe: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否带有纵向边框
   */
  border: {
    type: Boolean,
    default: false,
  },
  /**
   * Table 的尺寸
   */
  size: {
    type: String as PropType<SizeType>,
  },
  /**
   * 列的宽度是否自撑开
   */
  fit: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否显示表头
   */
  showHeader: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否要高亮当前行
   */
  highlightCurrentRow: {
    type: Boolean,
    default: false,
  },
  /**
   * 当前行的 key，只写属性
   */
  currentRowKey: {
    type: [String, Number],
  },
  /**
   * 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
   */
  rowClassName: {
    type: [String, Function as PropType<(data: TableRowRecord<any>) => string>],
  },
  /**
   * 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。
   */
  rowStyle: {
    type: [
      Object as CSSProperties,
      Function as PropType<(data: TableRowRecord<any>) => CSSProperties>,
    ],
  },
  /**
   * 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。
   */
  cellClassName: {
    type: [String, Function as PropType<(data: TableRowColumnRecord<any>) => string>],
  },
  /**
   * 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。
   */
  cellStyle: {
    type: [
      Object as CSSProperties,
      Function as PropType<(data: TableRowColumnRecord<any>) => CSSProperties>,
    ],
  },
  /**
   * 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
   */
  headerRowClassName: {
    type: [String, Function as PropType<(data: TableRowRecord<any>) => string>],
  },
  /**
   * 表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。
   */
  headerRowStyle: {
    type: [
      Object as CSSProperties,
      Function as PropType<(data: TableRowRecord<any>) => CSSProperties>,
    ],
  },
  /**
   * 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。
   */
  headerCellClassName: {
    type: [String, Function as PropType<(data: TableRowColumnRecord<any>) => string>],
  },
  /**
   * 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。
   */
  headerCellStyle: {
    type: [
      Object as CSSProperties,
      Function as PropType<(data: TableRowColumnRecord<any>) => CSSProperties>,
    ],
  },
  /**
   * 行数据的 Key
   */
  rowKey: {
    type: [String, Function as PropType<(data: any) => string>],
  },
  /**
   * 空数据时显示的文本内容， 也可以通过 #empty 设置
   */
  emptyText: {
    type: String,
    default: '暂无数据',
  },
  /**
   * 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
   */
  defaultExpandAll: {
    type: Boolean,
    default: false,
  },
  /**
   * 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
   */
  expandRowKeys: {
    type: [Array as PropType<any[]>],
  },
  /**
   * 默认的排序列的 prop 和顺序。 它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序
   */
  defaultSort: {
    type: Object as PropType<TableSorter>,
  },
  /**
   * tooltip effect 属性
   */
  tooltipEffect: {
    type: String as PropType<'dark' | 'light'>,
    default: 'dark',
  },
  /**
   * 是否在表尾显示合计行
   */
  showSummary: {
    type: Boolean,
    default: false,
  },
  /**
   * 合计行第一列的文本
   */
  sumText: {
    type: String,
    default: '合计',
  },
  /**
   * 自定义的合计计算方法
   */
  summaryMethod: {
    type: Function as PropType<(data: TableSummaryRecord<any>) => string[]>,
  },
  /**
   * 合并行或列的计算方法
   */
  spanMethod: {
    type: Function as PropType<
      (data: TableRowColumnRecord<any>) =>
        | number[]
        | {
            rowspan: number
            colspan: number
          }
    >,
  },
  /**
   * 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。 若为 true，则选中所有行；若为 false，则取消选择所有行
   */
  selectOnIndeterminate: {
    type: Boolean,
    default: true,
  },
  /**
   * 展示树形数据时，树节点的缩进
   */
  indent: {
    type: Number,
    default: 16,
  },
  /**
   * 是否懒加载子节点数据
   */
  lazy: {
    type: Boolean,
    default: false,
  },
  /**
   * 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息
   */
  load: {
    type: Function as PropType<
      (row: any, treeNode: TreeNode, resolve: (data: any[]) => void) => void
    >,
  },
  /**
   * 渲染嵌套数据的配置选项
   */
  treeProps: {
    type: Object as PropType<{
      hasChildren?: string | undefined
      children?: string | undefined
    }>,
    default: () => ({ hasChildren: 'hasChildren', children: 'children' }),
  },
  /**
   * 设置表格单元、行和列的布局方式
   */
  tableLayout: {
    type: String as PropType<TableLayoutType>,
    default: 'fixed',
  },
  /**
   * 总是显示滚动条
   */
  scrollbarAlwaysOn: {
    type: Boolean,
    default: false,
  },
  /**
   * ensure main axis minimum-size doesn't follow the content
   */
  flexible: {
    type: Boolean,
    default: false,
  },
}
