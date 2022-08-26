<template>
  <BasicDialog
    @register="registerDialog"
    title="编辑角色信息"
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
        <ElRadioGroup v-model="model.status">
          <ElRadio :label="1">启用</ElRadio>
          <ElRadio :label="0">禁用</ElRadio>
        </ElRadioGroup>
      </template>
    </BasicForm>
  </BasicDialog>
</template>

<script setup lang="ts">
import type { FormSchema } from '/@/components/Form'
import type { RoleResult } from '/@/api/system/role'

import { addRoleRequest, updateRoleRequest } from '/@/api/system/role'
import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import AssignPermTree from './AssignPermTree.vue'
import { ref, nextTick } from 'vue'
import { getMenuListRequest } from '/@/api/system/menu'

const emit = defineEmits(['register', 'success'])

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
      const permTree = await getMenuListRequest()

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
    label: '角色名称',
    prop: 'name',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入角色名称',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '角色标识',
    prop: 'uniqueKey',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入角色标识',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '父级角色',
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
    label: '分配权限',
    defaultValue: [],
    prop: 'permMenuIds',
    component: AssignPermTree,
    componentProps: {
      data: [],
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
    label: '排序',
    defaultValue: 0,
    prop: 'orderNum',
    component: 'ElInputNumber',
    componentProps: {
      min: 0,
    },
  },
  {
    label: '状态',
    prop: 'status',
    defaultValue: 1,
    slot: 'status',
  },
])
</script>
