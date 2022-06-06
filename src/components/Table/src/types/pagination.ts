/**
 * 同ElPagination的Props
 * https://element-plus.org/zh-CN/component/pagination.html
 */
export interface PaginationProps {
  /**
   * 是否使用小型分页样式
   */
  small?: boolean
  /**
   * 是否为分页按钮添加背景色
   */
  background?: boolean
  /**
   * 每页显示条目个数，支持 v-model 双向绑定
   */
  pageSize?: number
  /**
   * 每页显示条目数的初始值
   */
  defaultPageSize?: number
  /**
   * 总条目数
   */
  total?: number
  /**
   * 总页数 total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性
   */
  pageCount?: number
  /**
   * 设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠
   * 5 ≤ x ≤ 21 的奇数
   */
  pagerCount?: number
  /**
   * 当前页数，支持 v-model 双向绑定
   */
  currentPage?: number
  /**
   * 当前页数的初始值
   */
  defaultCurrentPage?: number
  /**
   * 组件布局，子组件名用逗号分隔
   * sizes / prev / pager / next / jumper / -> / total / slot
   *
   * like this: 'prev, pager, next, jumper, ->, total'
   */
  layout?: string
  /**
   * 每页显示个数选择器的选项设置: [10, 20, 30, 40, 50, 100]
   */
  pageSizes?: number[]
  /**
   * 每页显示个数选择器的下拉框类名
   */
  popperClass?: string
  /**
   * 替代图标显示的上一页文字
   */
  prevText?: string
  /**
   * 替代图标显示的下一页文字
   */
  nextText?: string
  /**
   * 是否禁用分页
   */
  disabled?: boolean
  /**
   * 只有一页时是否隐藏
   */
  hideOnSinglePage?: boolean
}
