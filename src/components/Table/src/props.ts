import type { PaginationProps } from './types/pagination'
import type { TableSetting, FetchSetting } from './types/table'
import type { TableColumn } from './types/column'

import defaultProps from 'element-plus/lib/components/table/src/table/defaults'

/**
 *
 * 二次封装表格
 * node_modules/element-plus/es/components/table/index.d.ts
 *
 * https://element-plus.org/zh-CN/component/table.html
 */
export const basicProps = {
  /**
   * 表格数据api请求, 与data互斥，优先使用api获取得到的数据
   */
  api: {
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
    default: null,
  },
  /**
   * 用于 api 的额外参数
   */
  searchInfo: {
    type: Object as PropType<Recordable>,
    default: null,
  },
  beforeFetch: {
    type: Function as PropType<Fn>,
    default: null,
  },
  afterFetch: {
    type: Function as PropType<Fn>,
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
   * 显示需要的表格设置，当showTableSetting启用时，需要隐藏需要各自设置为false，否则默认显示
   */
  tableSetting: {
    type: Object as PropType<TableSetting>,
    default: () => ({}),
  },
  /**
   * 分页字段设置
   */
  fetchSetting: {
    type: Object as PropType<FetchSetting>,
    default: () => ({}),
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
    type: [Object, Boolean] as PropType<PaginationProps | boolean>,
    default: null,
  },
  /**
   * 表格loading加载
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * 支持代码方式传入column属性渲染
   */
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: null,
  },
  /**
   * table自适应高度
   */
  adaptiveHeight: {
    type: Boolean,
    default: true,
  },
  /**
   * 容器高度是否固定，当给容器设置了高度又开启了自适应高度时可设置该值为true
   */
  containerHeightFixed: {
    type: Boolean,
    default: false,
  },
  /**
   * 自适应高度偏移， 计算结果-偏移量
   */
  adaptiveHeightOffset: {
    type: Number,
    default: 0,
  },
  /**
   * inset will remove inner padding
   */
  inset: {
    type: Boolean,
    default: false,
  },
  /**
   * ElTable原有的属性
   */
  ...defaultProps,
}
