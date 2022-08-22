<template>
  <BasicDialog
    @register="registerDialog"
    :title="t('views.system.menu.editform.title')"
    @confirm="submit"
  >
    <BasicForm
      @register="registerForm"
      :show-action-button-group="false"
      :schemas="schemas"
      label-width="110px"
      @submit="handleSubmit"
    >
      <template #type="{ model }">
        <el-radio-group v-model="model.type">
          <el-radio :label="0">{{ t('views.system.menu.menuTypeCatalogue') }}</el-radio>
          <el-radio :label="1">{{ t('views.system.menu.menuTypeMenu') }}</el-radio>
          <el-radio :label="2">{{ t('views.system.menu.menuTypePermission') }}</el-radio>
        </el-radio-group>
      </template>
      <template #isShow="{ model }">
        <el-radio-group v-model="model.isShow">
          <el-radio :label="1">{{ t('common.basic.show') }}</el-radio>
          <el-radio :label="0">{{ t('common.basic.hidden') }}</el-radio>
        </el-radio-group>
      </template>
      <template #viewPath="{ model }">
        <ElSelect v-model="model.viewPath" class="w-full" clearable>
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
import type { MenuResult } from '/@/api/system/menu.api'

import { useAddMenuRequest, useUpdateMenuRequest } from '/@/api/system/menu.api'
import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import { useTransl } from '/@/composables/core/useTransl'
import { ref, unref } from 'vue'
import { IconPicker } from '/@/components/Icon'
import { usePermissionCascader } from '/@/composables/component/usePermissionCascader'
import { filter } from '/@/utils/helper/tree'
import { isUrl } from '/@/utils/is'
import { getDynamicImportViews } from '/@/router/helper/routeHelper'
import { I18nInput } from '/@/components/Input'

const emit = defineEmits(['register', 'success'])

const { t } = useTransl()

const updateMenuId = ref<null | number>(null)

const [addMenuRequest, _] = useAddMenuRequest()
const [updateMenuRequest, __] = useUpdateMenuRequest()

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
    label: t('views.system.menu.type'),
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
    label: t('views.system.menu.name'),
    defaultValue: '',
    prop: 'name',
    component: I18nInput,
    rules: {
      required: true,
      type: 'string',
      message: `${t('component.form.enter')}${t('views.system.menu.name')}`,
    },
  },
  {
    label: t('views.system.menu.parent'),
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
          return t(data.name)
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
    label: t('views.system.menu.router'),
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
          cb(new Error(`${t('component.form.enter')}${t('views.system.menu.router')}`))
          return
        }
        if (!isUrl(value) && !value.startsWith('/')) {
          cb(new Error(`${t('component.form.invalid')}${t('views.system.menu.router')}`))
          return
        }
        cb()
      },
    },
  },
  {
    label: t('views.system.menu.viewPath'),
    defaultValue: '',
    prop: 'viewPath',
    hidden: ({ model }) => {
      return model.type === 2 || model.type === 0
    },
    slot: 'viewPath',
  },
  {
    label: t('views.system.menu.icon'),
    defaultValue: '',
    prop: 'icon',
    hidden: ({ model }) => {
      return model.type === 2
    },
    component: IconPicker,
  },
  {
    label: t('views.system.menu.isShow'),
    prop: 'isShow',
    defaultValue: 1,
    hidden: ({ model }) => {
      return model.type === 2
    },
    slot: 'isShow',
  },
  {
    label: t('views.system.menu.perm'),
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
      message: `${t('component.form.choose')}${t('views.system.menu.perm')}`,
    },
  },
  {
    label: t('views.system.menu.orderNum'),
    defaultValue: 0,
    prop: 'orderNum',
    component: 'ElInputNumber',
    componentProps: {
      min: 0,
    },
  },
])
</script>
