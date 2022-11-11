import type { UserResult } from '/@/api/system/user'
import type { TableColumn } from '/@/components/Table'
import { StatusTypeEnum } from '/@/enums/typeEnum'

export function createUserColumns(): TableColumn[] {
  return [
    {
      label: '账号',
      prop: 'account',
      align: 'center',
      width: 160,
    },
    {
      label: '姓名',
      prop: 'username',
      align: 'center',
      width: 160,
    },
    {
      label: '所属部门',
      prop: 'dept',
      align: 'center',
      width: 180,
      formatter: (row: UserResult) => {
        return row.dept.name
      },
    },
    {
      label: '所属角色',
      prop: 'roles',
      align: 'center',
      width: 240,
      slot: 'roles',
    },
    {
      label: '职称',
      prop: 'profession',
      align: 'center',
      width: 180,
      formatter: (row: UserResult) => {
        return row.profession.name
      },
    },
    {
      label: '岗位',
      prop: 'job',
      align: 'center',
      width: 180,
      formatter: (row: UserResult) => {
        return row.job.name
      },
    },
    {
      label: '性别',
      align: 'center',
      prop: 'gender',
      width: 120,
      formatter: (row: UserResult) => {
        if (row.gender === 1) {
          return '女'
        } else if (row.gender === 2) {
          return '男'
        } else {
          return '保密'
        }
      },
    },
    {
      label: '手机号',
      prop: 'mobile',
      align: 'center',
      width: 180,
    },
    {
      label: '昵称',
      prop: 'nickname',
      align: 'center',
      width: 160,
    },
    {
      label: '邮箱',
      prop: 'email',
      align: 'center',
      width: 180,
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
      label: '排序',
      prop: 'orderNum',
      align: 'center',
      width: 120,
    },
    {
      label: '操作',
      align: 'center',
      width: 120,
      fixed: 'right',
      slot: 'action',
    },
  ]
}

export function createDeptColumns(): TableColumn[] {
  return [
    {
      label: '部门名称',
      prop: 'name',
    },
  ]
}
