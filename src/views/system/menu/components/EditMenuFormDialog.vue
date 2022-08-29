<template>
  <BasicDialog @register="registerDialog" title="编辑菜单信息" @confirm="submit">
    <BasicForm
      @register="registerForm"
      :show-action-button-group="false"
      :schemas="schemas"
      label-width="110px"
      @submit="handleSubmit"
    >
      <template #type="{ model }">
        <ElRadioGroup v-model="model.type">
          <ElRadio :label="0">目录</ElRadio>
          <ElRadio :label="1">菜单</ElRadio>
          <ElRadio :label="2">权限</ElRadio>
        </ElRadioGroup>
      </template>
      <template #isShow="{ model }">
        <ElRadioGroup v-model="model.isShow">
          <ElRadio :label="1">显示</ElRadio>
          <ElRadio :label="0">隐藏</ElRadio>
        </ElRadioGroup>
      </template>
      <template #viewPath="{ model }">
        <ElSelect v-model="model.viewPath" class="w-full" clearable allow-create filterable>
          <el-option
            v-for="item in allDynamicImportViews"
            :key="item"
            :label="item"
            :value="item"
          />
        </ElSelect>
      </template>
    </BasicForm>
  </BasicDialog>
</template>

<script setup lang="ts">
import type { FormSchema } from '/@/components/Form'
import type { MenuResult } from '/@/api/system/menu'

import { addMenuRequest, updateMenuRequest } from '/@/api/system/menu'
import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import { ref, unref } from 'vue'
import { IconPicker } from '/@/components/Icon'
import { usePermissionCascader } from '/@/composables/component/usePermissionCascader'
import { filter } from '/@/utils/helper/tree'
import { isUrl } from '/@/utils/is'
import { getDynamicImportViews } from '/@/router/helper/routeHelper'

const emit = defineEmits(['register', 'success'])

const updateMenuId = ref<null | number>(null)

const [registerForm, { updateSchema, submit, setProps: setFormProps, setFormModel }] = useForm()

const { getOptionsRef, transformValues, reverseValues } = usePermissionCascader()

const [registerDialog, { setProps: setDialogProps, closeDialog }] = useDialogInner(
  (data: { list?: MenuResult[]; item?: MenuResult }) => {
    const menus = filter<MenuResult>(data.list || [], (item): boolean => {
      // 过滤权限节点，权限节点不能作为父级
      return item.type === 0 || item.type === 1
    })
    const menuTree = [
      {
        id: 0,
        name: '#',
        children: menus,
      },
    ]

    // update tree props data
    updateSchema({
      prop: 'parentId',
      componentProps: {
        data: menuTree,
      },
    })

    // is update?
    if (data.item) {
      const values = {
        ...data.item,
        perms: reverseValues(data.item.perms),
      }
      setFormModel(values)
      updateMenuId.value = data.item.id
    } else {
      updateMenuId.value = null
    }
  }
)

async function handleSubmit(res: Omit<MenuResult, 'id'>) {
  try {
    setFormProps({ disabled: true })
    setDialogProps({ confirmBtnProps: { loading: true } })

    // 转换权限值
    if (res.type === 2) {
      res.perms = transformValues(res.perms as unknown as string[][])
    }

    // 未实现，默认处理
    res.activeRouter = ''

    if (updateMenuId.value === null) {
      await addMenuRequest(res)
    } else {
      await updateMenuRequest({
        ...res,
        id: updateMenuId.value,
      })
    }

    // close
    closeDialog()

    emit('success')
  } finally {
    setFormProps({ disabled: false })
    setDialogProps({ confirmBtnProps: { loading: false } })
  }
}

const allDynamicImportViews = getDynamicImportViews()

const schemas = ref<FormSchema[]>([
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
      options: unref(getOptionsRef),
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
])
</script>
