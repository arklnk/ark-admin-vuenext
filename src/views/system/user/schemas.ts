import type { FormSchema } from '/@/components/Form'

export const schemas: FormSchema[] = [
  {
    label: '账号',
    prop: 'account',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入账号',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '姓名',
    prop: 'username',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入姓名',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '性别',
    prop: 'gender',
    defaultValue: 0,
    slot: 'gender',
    colProps: {
      span: 12,
    },
  },
  {
    label: '昵称',
    prop: 'nickname',
    defaultValue: '',
    component: 'ElInput',
    colProps: {
      span: 12,
    },
  },
  {
    label: '邮箱',
    prop: 'email',
    defaultValue: '',
    component: 'ElInput',
    colProps: {
      span: 12,
    },
  },
  {
    label: '手机号',
    prop: 'mobile',
    defaultValue: '',
    component: 'ElInput',
    colProps: {
      span: 12,
    },
  },
  {
    label: '所属角色',
    prop: 'roleIds',
    defaultValue: [],
    component: 'ElTreeSelect',
    componentProps: {
      data: [],
      multiple: true,
      style: 'width: 100%;',
      checkStrictly: true,
      showCheckbox: true,
      nodeKey: 'id',
      renderAfterExpand: false,
      props: {
        label: (data: Recordable): string => {
          return data.name
        },
        disabled: (data: Recordable): boolean => {
          // has为0，禁止删除
          return data.has === 0
        },
      },
    },
    rules: {
      required: true,
      type: 'array',
      min: 1,
      message: '请选择所属角色',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '所属部门',
    prop: 'deptId',
    component: 'ElTreeSelect',
    componentProps: {
      data: [],
      style: 'width: 100%;',
      checkStrictly: true,
      nodeKey: 'id',
      renderAfterExpand: false,
      props: {
        label: (data: Recordable): string => {
          return data.name
        },
      },
    },
    rules: {
      required: true,
      type: 'number',
      min: 1,
      message: '请选择所属部门',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '职称',
    prop: 'professionId',
    component: 'ElTreeSelect',
    componentProps: {
      data: [],
      style: 'width: 100%;',
      checkStrictly: true,
      nodeKey: 'id',
      props: {
        label: (data: Recordable): string => {
          return data.name
        },
      },
    },
    rules: {
      required: true,
      type: 'number',
      min: 1,
      message: '请选择职称',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '岗位',
    prop: 'jobId',
    component: 'ElTreeSelect',
    componentProps: {
      data: [],
      style: 'width: 100%;',
      checkStrictly: true,
      nodeKey: 'id',
      props: {
        label: (data: Recordable): string => {
          return data.name
        },
      },
    },
    rules: {
      required: true,
      type: 'number',
      min: 1,
      message: '请选择岗位',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '排序',
    prop: 'orderNum',
    defaultValue: 0,
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
    slot: 'status',
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

export const pwdSchemas: FormSchema[] = [
  {
    label: '新密码',
    prop: 'password',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      min: 6,
      max: 12,
      message: '请输入新密码,长度6-12位',
    },
  },
]
