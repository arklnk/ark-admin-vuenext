export default {
  table: {
    pagination: {
      pageSizes: [10, 50, 80, 100],
      pageSize: 10,
      layout: 'total, sizes, prev, pager, next',
      background: true,
      small: true,
    },
    fetchSetting: {
      pageField: 'page',
      sizeField: 'limit',
      listField: 'list',
      totalField: 'pagination.total',
    },
  },
}
