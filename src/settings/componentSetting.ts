import type { FetchSetting } from '/@/components/Table/src/types/table'
import type { PaginationProps } from '/@/components/Table/src/types/pagination'

export default {
  table: {
    pagination: {
      pageSizes: [10, 50, 80, 100],
      pageSize: 10,
      defaultPageSize: 10,
      layout: 'prev, pager, next, jumper, ->, total',
      pagerCount: 7,
    } as PaginationProps,
    fetchSetting: {
      pageField: 'pagination.page',
      sizeField: 'pagination.size',
      listField: 'list',
      totalField: 'pagination.total',
    } as FetchSetting,
    treeProps: { hasChildren: 'hasChildren', children: 'children' },
  },
}
