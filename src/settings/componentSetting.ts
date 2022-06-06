export default {
  table: {
    pagination: {
      pageSizes: [10, 50, 80, 100],
      defaultPageSize: 10,
      layout: 'prev, pager, next, jumper, ->, total',
    },
    fetchSetting: {
      pageField: 'pagination.page',
      sizeField: 'pagination.size',
      listField: 'list',
      totalField: 'pagination.total',
    },
  },
}
