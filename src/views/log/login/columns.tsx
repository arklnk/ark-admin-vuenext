import type { TableColumn } from '/@/components/Table'
import { StatusTypeEnum } from '/@/enums/typeEnum'

export function createColumns(): TableColumn[] {
  return [
    {
      type: 'index',
    },
    {
      label: '操作账号',
      prop: 'account',
    },
    {
      align: 'center',
      label: 'IP',
      prop: 'ip',
    },
    {
      align: 'center',
      label: '请求状态',
      prop: 'status',
      render: ({ row }) => {
        return (
          <el-tag type={row.status === StatusTypeEnum.Successful ? 'success' : 'danger'}>
            {row.status === StatusTypeEnum.Successful ? '成功' : '失败'}
          </el-tag>
        )
      },
    },
    {
      align: 'center',
      label: '请求路径',
      prop: 'uri',
    },
    {
      align: 'center',
      label: '登录时间',
      prop: 'createTime',
    },
  ]
}
