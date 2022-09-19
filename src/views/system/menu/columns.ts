import type { TableColumn } from '/@/components/Table'

export function createColumns(): TableColumn[] {
  return [
    {
      width: 300,
      label: '菜单名称',
      prop: 'name',
      slot: 'name',
    },
    {
      align: 'center',
      width: 120,
      label: '类型',
      prop: 'type',
      slot: 'type',
    },
    {
      width: 80,
      align: 'center',
      label: '图标',
      prop: 'icon',
      slot: 'icon',
    },
    {
      align: 'center',
      label: '路由',
      prop: 'router',
      showOverflowTooltip: true,
      minWidth: 240,
    },
    {
      align: 'center',
      label: '视图路径',
      prop: 'viewPath',
      showOverflowTooltip: true,
      minWidth: 240,
    },
    {
      width: 340,
      align: 'center',
      label: '权限',
      prop: 'perms',
      slot: 'perms',
    },
    {
      width: 80,
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
}
