import type { TableColumn } from '/@/components/Table'
import { StatusTypeEnum } from '/@/enums/typeEnum'

export function createColumns(): TableColumn[] {
  return [
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
      showOverflowTooltip: true,
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
}
