<template>
  <BasicDialog
    @register="registerDialog"
    :title="t('views.system.role.editform.title')"
    @confirm="submit"
    @visible-change="handleVisibleChange"
  >
    <BasicForm
      :show-action-button-group="false"
      @register="registerForm"
      :schemas="schemas"
      label-width="100px"
      @submit="handleSubmit"
    >
      <template #status="{ model }">
        <el-radio-group v-model="model.status">
          <el-radio :label="1">{{ t('common.basic.enable') }}</el-radio>
          <el-radio :label="0">{{ t('common.basic.disabled') }}</el-radio>
        </el-radio-group>
      </template>
    </BasicForm>
  </BasicDialog>
</template>

<script setup lang="ts">
import type { FormSchema } from '/@/components/Form'
import type { RoleResult } from '/@/api/system/role.api'
// import type { MenuResult } from '/@/api/system/menu.api'

import { useAddRoleRequest, useUpdateRoleRequest } from '/@/api/system/role.api'
import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import AssignPermTree from './AssignPermTree.vue'
import { useTransl } from '/@/composables/core/useTransl'
import { ref, nextTick } from 'vue'
import { useGetMenuListRequest } from '/@/api/system/menu.api'
import { listToTree } from '/@/utils/helper/tree'

const emit = defineEmits(['register', 'success'])

const { t } = useTransl()
const updateRoleId = ref<number | null>(null)

const [registerForm, { updateSchema, submit, setProps: setFormProps, setFormModel }] = useForm()
const [registerDialog, { closeDialog, setProps: setDialogProps }] = useDialogInner(
  (data: { list: RoleResult[]; item: RoleResult }) => {
    const roleTree = [
      {
        id: 0,
        name: '#',
        children: data.list || [],
      },
    ]

    updateSchema({
      prop: 'parentId',
      componentProps: {
        data: roleTree,
      },
    })

    // is update?
    if (data.item) {
      setFormModel(data.item)
      updateRoleId.value = data.item.id
    } else {
      updateRoleId.value = null
    }
  }
)

const [addRoleRequest, _] = useAddRoleRequest()
const [getMenuListRequest, __] = useGetMenuListRequest()
const [updateRoleRequest, ___] = useUpdateRoleRequest()

async function handleSubmit(res: Omit<RoleResult, 'id'>) {
  try {
    setFormProps({ disabled: true })
    setDialogProps({ confirmBtnProps: { loading: true } })

    if (updateRoleId.value === null) {
      await addRoleRequest(res)
    } else {
      await updateRoleRequest({
        ...res,
        id: updateRoleId.value!,
      })
    }

    closeDialog()

    emit('success')
  } finally {
    setFormProps({ disabled: false })
    setDialogProps({ confirmBtnProps: { loading: false } })
  }
}

// when open to fetch perm menu list
function handleVisibleChange(visible: boolean) {
  if (!visible) return

  nextTick(async () => {
    try {
      setDialogProps({ loading: true })
      const { list } = await getMenuListRequest()
      const permTree = listToTree(list)

      updateSchema({
        prop: 'permMenuIds',
        componentProps: {
          data: permTree,
        },
      })
    } catch (e) {
      closeDialog()
    } finally {
      setDialogProps({ loading: false })
    }
  })
}

const schemas = ref<FormSchema[]>([
  {
    label: t('views.system.role.name'),
    prop: 'name',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: `${t('component.form.enter')}${t('views.system.role.name')}`,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.system.role.uniqueKey'),
    prop: 'uniqueKey',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: `${t('component.form.enter')}${t('views.system.role.uniqueKey')}`,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.system.role.editform.parent'),
    defaultValue: 0,
    prop: 'parentId',
    component: 'ElTreeSelect',
    componentProps: {
      style: 'width: 100%;',
      nodeKey: 'id',
      data: [],
      defaultExpandAll: true,
      props: {
        label: (data: RoleResult): string => {
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
    label: t('views.system.role.editform.permissionAssign'),
    defaultValue: [],
    prop: 'permMenuIds',
    component: AssignPermTree,
    componentProps: {
      data: [],
    },
  },
  {
    label: t('common.basic.remark'),
    prop: 'remark',
    defaultValue: '',
    component: 'ElInput',
    componentProps: {
      type: 'textarea',
      rows: 3,
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
  {
    label: t('common.basic.status'),
    prop: 'status',
    defaultValue: 1,
    slot: 'status',
  },
])
</script>
