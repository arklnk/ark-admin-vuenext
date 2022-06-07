export default {
  table: {
    defaultPageSizes: [10, 50, 80, 100],
    defaultPageSize: 10,
    defaultLayout: 'prev, pager, next, jumper, ->, total',
    fetchSetting: {
      pageField: 'page',
      sizeField: 'size',
      listField: 'list',
      totalField: 'pagination.total',
    },
  },
}
