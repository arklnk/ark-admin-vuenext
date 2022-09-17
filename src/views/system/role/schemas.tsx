import type { RoleResult } from '/@/api/system/role'
import type { FormSchema } from '/@/components/Form'

import AssignPermTree from './AssignPermTree.vue'

export function createSchemas(): FormSchema[] {
  return [
    {
      label: '角色名称',
      prop: 'name',
      defaultValue: '',
      component: 'ElInput',
      rules: {
        required: true,
        type: 'string',
        message: '请输入角色名称',
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: '角色标识',
      prop: 'uniqueKey',
      defaultValue: '',
      component: 'ElInput',
      rules: {
        required: true,
        type: 'string',
        message: '请输入角色标识',
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: '父级角色',
      defaultValue: 0,
      prop: 'parentId',
      component: 'ElTreeSelect',
      componentProps: {
        style: 'width: 100%;',
        nodeKey: 'id',
        data: [],
        checkStrictly: true,
        defaultExpandAll: true,
        props: {
          label: (data: RoleResult): string => {
            return data.name
          },
        },
      },
      rules: {
        required: true,
        type: 'number',
        min: 0,
      },
    },
    {
      label: '分配权限',
      defaultValue: [],
      prop: 'permMenuIds',
      component: AssignPermTree,
      componentProps: {
        data: [],
      },
    },
    {
      label: '备注',
      prop: 'remark',
      defaultValue: '',
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 3,
      },
    },
    {
      label: '排序',
      defaultValue: 0,
      prop: 'orderNum',
      component: 'ElInputNumber',
      componentProps: {
        min: 0,
      },
    },
    {
      label: '状态',
      prop: 'status',
      defaultValue: 1,
      render: ({ model }) => {
        return (
          <el-radio-group v-model={model.status}>
            <el-radio label={1}>启用</el-radio>
            <el-radio label={0}>禁用</el-radio>
          </el-radio-group>
        )
      },
    },
  ]
}
