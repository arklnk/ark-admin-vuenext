import type { MenuResult } from '/@/api/system/menu'
import type { FormSchema } from '/@/components/Form'

import { IconPicker } from '/@/components/Icon'
import { isUrl } from '/@/utils/is'

export const schemas: FormSchema[] = [
  {
    label: '类型',
    defaultValue: 0,
    prop: 'type',
    slot: 'type',
    rules: {
      required: true,
      min: 0,
      max: 2,
      type: 'number',
    },
  },
  {
    label: '菜单名称',
    defaultValue: '',
    prop: 'name',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入菜单名称',
    },
  },
  {
    label: '父级菜单',
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
        label: (data: MenuResult): string => {
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
    label: '路由',
    defaultValue: '',
    prop: 'router',
    hidden: ({ model }) => {
      return model.type === 2
    },
    component: 'ElInput',
    rules: {
      required: true,
      validator: (_, value: string, cb) => {
        if (!value) {
          cb(new Error('请输入路由'))
          return
        }
        if (!isUrl(value) && !value.startsWith('/')) {
          cb(new Error('无效的路由'))
          return
        }
        cb()
      },
    },
  },
  {
    label: '视图路径',
    defaultValue: '',
    prop: 'viewPath',
    hidden: ({ model }) => {
      return model.type === 2 || model.type === 0
    },
    slot: 'viewPath',
  },
  {
    label: '图标',
    defaultValue: '',
    prop: 'icon',
    hidden: ({ model }) => {
      return model.type === 2
    },
    component: IconPicker,
  },
  {
    label: '状态',
    prop: 'isShow',
    defaultValue: 1,
    hidden: ({ model }) => {
      return model.type === 2
    },
    slot: 'isShow',
  },
  {
    label: '权限',
    defaultValue: [],
    prop: 'perms',
    hidden: ({ model }) => {
      return model.type === 1 || model.type === 0
    },
    component: 'ElCascader',
    changeEvent: 'change',
    componentProps: {
      style: 'width: 100%;',
      options: [],
      clearable: true,
      props: {
        expandTrigger: 'hover',
        multiple: true,
      },
    },
    rules: {
      required: true,
      type: 'array',
      min: 1,
      message: '请选择权限',
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
]
