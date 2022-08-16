<template>
  <BasicDialog @register="registerDialog" :title="t('views.system.menu.form.title')">
    <BasicForm
      @register="registerForm"
      :show-action-button-group="false"
      :schemas="schemas"
      label-width="100px"
    >
      <template #type="{ model }">
        <el-radio-group v-model="model.type">
          <el-radio :label="0">{{ t('views.system.menu.menuTypeCatalogue') }}</el-radio>
          <el-radio :label="1">{{ t('views.system.menu.menuTypeMenu') }}</el-radio>
          <el-radio :label="2">{{ t('views.system.menu.menuTypePermission') }}</el-radio>
        </el-radio-group>
      </template>
    </BasicForm>
  </BasicDialog>
</template>

<script setup lang="ts">
import type { FormSchema } from '/@/components/Form'

import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import { useTransl } from '/@/composables/core/useTransl'
import { ref, unref } from 'vue'
import { IconPicker } from '/@/components/Icon'
import { usePermissionCascader } from '/@/composables/component/usePermissionCascader'

defineEmits(['register'])

const { t } = useTransl()

interface MenuTreeSelect {
  id: number
  name: string
  parentId?: number
  children?: MenuTreeSelect[]
}

const [registerForm, { updateSchema }] = useForm()

const { getOptionsRef } = usePermissionCascader()

const [registerDialog] = useDialogInner(
  (data: { menus?: MenuTreeSelect[]; item?: MenuTreeSelect }) => {
    const menuTree = [
      {
        id: 0,
        name: '#',
        children: data.menus || [],
      },
    ]

    updateSchema({
      prop: 'parentId',
      componentProps: {
        data: menuTree,
      },
    })
  }
)

const schemas = ref<FormSchema[]>([
  {
    label: t('views.system.menu.type'),
    defaultValue: 0,
    prop: 'type',
    slot: 'type',
  },
  {
    label: t('views.system.menu.name'),
    defaultValue: '',
    prop: 'name',
    component: 'ElInput',
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
      props: {
        label: 'name',
      },
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
  },
  {
    label: t('views.system.menu.viewPath'),
    defaultValue: '',
    prop: 'viewPath',
    hidden: ({ model }) => {
      return model.type === 2
    },
    component: 'ElInput',
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
  },
])
</script>
