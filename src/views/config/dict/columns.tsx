import type { TableColumn } from '/@/components/Table'

import { DictValueTypes } from './DictValueType'
import { StatusTypeEnum } from '/@/enums/typeEnum'

export function createDictItemColumns(): TableColumn[] {
  return [
    {
      label: '字典项名称',
      prop: 'name',
      width: 220,
    },
    {
      label: '字典项标识',
      prop: 'uniqueKey',
      width: 120,
      align: 'center',
    },
    {
      label: '值类型',
      prop: 'type',
      width: 200,
      align: 'center',
      formatter: (row: Recordable) => {
        return DictValueTypes.find((e) => e.value === row.type)!.label
      },
    },
    {
      label: '字典项值',
      prop: 'value',
      width: 340,
      showOverflowTooltip: true,
      align: 'center',
    },
    {
      align: 'center',
      label: '状态',
      prop: 'status',
      width: 120,
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
      width: 300,
      showOverflowTooltip: true,
    },
    {
      align: 'center',
      label: '排序',
      width: 100,
      prop: 'orderNum',
    },
    {
      align: 'center',
      label: '操作',
      width: 140,
      fixed: 'right',
      slot: 'action',
    },
  ]
}

export function createDictColumns(): TableColumn[] {
  return [
    {
      label: '字典名称',
      prop: 'name',
      headerSlot: 'dictHeader',
    },
  ]
}
