import type { TableColumn } from '/@/components/Table'
import { StatusTypeEnum } from '/@/enums/typeEnum'

export function createColumns(): TableColumn[] {
  return [
    {
      width: 300,
      label: '部门名称',
      prop: 'name',
    },
    {
      align: 'center',
      width: 140,
      label: '部门标识',
      prop: 'uniqueKey',
    },
    {
      align: 'center',
      width: 300,
      label: '部门全称',
      prop: 'fullName',
    },
    {
      align: 'center',
      width: 120,
      label: '部门类型',
      prop: 'type',
      slot: 'type',
    },
    {
      align: 'center',
      width: 100,
      label: '状态',
      prop: 'status',
      render: ({ row }) => {
        return (
          <el-tag type={row.status === StatusTypeEnum.Enable ? 'success' : 'danger'}>
            {row.status === StatusTypeEnum.Disable ? '禁用' : '启用'}
          </el-tag>
        )
      },
    },
    {
      align: 'center',
      label: '备注',
      prop: 'remark',
      minWidth: 280,
      showOverflowTooltip: true,
    },
    {
      align: 'center',
      width: 80,
      label: '排序',
      prop: 'orderNum',
    },
    {
      width: 140,
      align: 'center',
      label: '操作',
      fixed: 'right',
      slot: 'action',
    },
  ]
}
