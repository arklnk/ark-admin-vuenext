import type { TableColumn } from '/@/components/Table'

export const columns: TableColumn[] = [
  {
    label: '角色名称',
    prop: 'name',
    width: 280,
  },
  {
    label: '角色标识',
    prop: 'uniqueKey',
    width: 220,
    align: 'center',
  },
  {
    align: 'center',
    width: 100,
    label: '状态',
    prop: 'status',
    formatter: (row: Recordable): string => {
      return row.status === 0 ? '禁用' : '启用'
    },
  },
  {
    align: 'center',
    label: '备注',
    prop: 'remark',
    showTooltipWhenOverflow: true,
  },
  {
    width: 100,
    align: 'center',
    label: '排序',
    prop: 'orderNum',
  },
  {
    width: 140,
    align: 'center',
    label: '操作',
    slot: 'action',
    fixed: 'right',
  },
]
