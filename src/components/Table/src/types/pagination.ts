import { PaginationProps as ElPaginationProps } from 'element-plus'

export interface PaginationProps extends Partial<Writable<ElPaginationProps>> {
  // 分页位置,默认为right
  position?: 'left' | 'center' | 'right'
}
