import type { TableColumn } from '/@/components/Table'
import { StatusTypeEnum } from '/@/enums/typeEnum'

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
      label: '排序',
      prop: 'order_num',
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
