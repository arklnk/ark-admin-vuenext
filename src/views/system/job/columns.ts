import type { TableColumn } from '/@/components/Table'

export function createColumns(): TableColumn[] {
  return [
    {
      label: '岗位名称',
      prop: 'name',
      minWidth: 300,
      align: 'center',
    },
    {
      align: 'center',
      label: '状态',
      prop: 'status',
      formatter: (row: Recordable) => {
        return row.status === 0 ? '禁用' : '启用'
      },
    },
    {
      align: 'center',
      label: '排序',
      prop: 'orderNum',
    },
    {
      align: 'center',
      label: '操作',
      slot: 'action',
      width: 140,
      fixed: 'right',
    },
  ]
}
