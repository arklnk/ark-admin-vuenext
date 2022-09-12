import type { DeptResult } from '/@/api/system/dept'
import type { FormSchema } from '/@/components/Form'

export const schemas: FormSchema[] = [
  {
    label: '部门名称',
    defaultValue: '',
    prop: 'name',
    colProps: {
      span: 12,
    },
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入部门名称',
    },
  },
  {
    label: '部门标识',
    defaultValue: '',
    prop: 'uniqueKey',
    component: 'ElInput',
    colProps: {
      span: 12,
    },
    rules: {
      required: true,
      type: 'string',
      message: '请输入部门标识',
    },
  },
  {
    label: '父级部门',
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
        label: (data: DeptResult): string => {
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
    label: '部门类型',
    defaultValue: 1,
    prop: 'type',
    slot: 'type',
    colProps: {
      span: 12,
    },
  },
  {
    label: '部门全称',
    defaultValue: '',
    prop: 'fullName',
    component: 'ElInput',
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
      rows: 3,
    },
  },
  {
    label: '状态',
    defaultValue: 1,
    prop: 'status',
    slot: 'status',
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
]
