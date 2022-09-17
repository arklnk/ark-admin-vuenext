import type { FormSchema } from '/@/components/Form'

import { DictValueTypes } from './DictValueType'

export function createDictSchemas(): FormSchema[] {
  return [
    {
      label: '名称',
      prop: 'name',
      defaultValue: '',
      component: 'ElInput',
      rules: {
        required: true,
        type: 'string',
        message: '请输入名称',
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: '标识',
      prop: 'uniqueKey',
      defaultValue: '',
      component: 'ElInput',
      rules: {
        required: true,
        type: 'string',
        message: '请输入标识',
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: '值类型',
      prop: 'type',
      defaultValue: 1,
      component: 'ElTreeSelect',
      componentProps: {
        data: DictValueTypes,
        style: 'width: 100%;',
        checkStrictly: true,
        nodeKey: 'value',
        renderAfterExpand: false,
        props: {
          label: (data: Recordable): string => {
            return data.label
          },
        },
      },
      rules: {
        required: true,
        type: 'number',
        min: 0,
        message: '请选择值类型',
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: '字典项值',
      prop: 'value',
      component: 'ElInput',
      defaultValue: '',
      colProps: {
        span: 12,
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
      colProps: {
        span: 12,
      },
    },
    {
      label: '状态',
      defaultValue: 1,
      prop: 'status',
      render: ({ model }) => {
        return (
          <el-radio-group v-model={model.status}>
            <el-radio label={1}>启用</el-radio>
            <el-radio label={0}>禁用</el-radio>
          </el-radio-group>
        )
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: '备注',
      prop: 'remark',
      defaultValue: '',
      component: 'ElInput',
      componentProps: {
        type: 'textarea',
        rows: 2,
      },
    },
  ]
}
