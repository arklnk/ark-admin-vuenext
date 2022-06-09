export default {
  table: {
    pagination: {
      pageSizes: [10, 50, 80, 100],
      pageSize: 10,
      layout: 'total, sizes, prev, pager, next',
      background: true,
    },
    fetchSetting: {
      pageField: 'page',
      sizeField: 'size',
      listField: 'list',
      totalField: 'pagination.total',
    },
  },
}
