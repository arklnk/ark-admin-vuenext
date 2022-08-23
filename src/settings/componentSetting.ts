export default {
  table: {
    pagination: {
      pageSizes: [50, 80, 100, 200],
      pageSize: 50,
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
