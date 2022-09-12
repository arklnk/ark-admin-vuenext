import type { FormSchema } from '/@/components/Form'

export const schemas: FormSchema[] = [
  {
    label: '职称',
    prop: 'name',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入职称',
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
