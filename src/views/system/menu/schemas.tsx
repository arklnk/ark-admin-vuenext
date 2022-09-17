import type { MenuResult } from '/@/api/system/menu'
import type { FormSchema } from '/@/components/Form'

import { IconPicker } from '/@/components/Icon'
import { getDynamicImportViews } from '/@/router/helper/routeHelper'
import { isProdMode } from '/@/utils/env'
import { isUrl } from '/@/utils/is'

export function createPermSchema(): FormSchema {
  const schema: FormSchema = {
    label: '权限',
    defaultValue: [],
    prop: 'perms',
    hidden: ({ model }) => {
      return model.type === 1 || model.type === 0
    },
    rules: {
      required: true,
      type: 'array',
      min: 1,
      message: '请选择权限',
    },
  }

  if (isProdMode()) {
    // 生产环境下严格按照当前用户具有的权限进行分配
    schema.component = 'ElCascader'
    schema.changeEvent = 'change'
    schema.componentProps = {
      style: 'width: 100%;',
      options: [],
      clearable: true,
      props: {
        expandTrigger: 'click',
        multiple: true,
      },
    }
  } else {
    // 开发环境下具有自定义性
    schema.render = ({ model }) => {
      function handleInput(e: string) {
        model.perms = e.split(',').map((e) => e.trim())
      }
      return (
        <el-input
          modelValue={(model.perms || []).join(',')}
          onInput={handleInput}
          placeholder="请指定权限,多个权限使用逗号分隔"
        />
      )
    }
  }

  return schema
}

export const schemas: FormSchema[] = [
  {
    label: '类型',
    defaultValue: 0,
    prop: 'type',
    render: ({ model }) => {
      return (
        <el-radio-group v-model={model.type}>
          <el-radio label={0}>目录</el-radio>
          <el-radio label={1}>菜单</el-radio>
          <el-radio label={2}>权限</el-radio>
        </el-radio-group>
      )
    },
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
    render: ({ model }) => {
      const allDynamicImportViews = getDynamicImportViews()

      return (
        <el-select v-model={model.viewPath} style="width: 100%" clearable allow-create filterable>
          {allDynamicImportViews.map((item) => (
            <el-option label={item} value={item} />
          ))}
        </el-select>
      )
    },
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
  createPermSchema(),
  {
    label: '状态',
    prop: 'isShow',
    defaultValue: 1,
    hidden: ({ model }) => {
      return model.type === 2
    },
    render: ({ model }) => {
      return (
        <el-radio-group v-model={model.isShow}>
          <el-radio label={1}>显示</el-radio>
          <el-radio label={0}>隐藏</el-radio>
        </el-radio-group>
      )
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
