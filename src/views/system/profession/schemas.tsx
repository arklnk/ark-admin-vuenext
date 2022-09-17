import type { FormSchema } from '/@/components/Form'

export function createSchemas(): FormSchema[] {
  return [
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
}
