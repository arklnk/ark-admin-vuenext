<template>
  <BasicDialog
    @register="registerDialog"
    :title="t('views.system.dept.editform.title')"
    @confirm="submit"
  >
    <BasicForm
      :schemas="schemas"
      label-width="100px"
      :show-action-button-group="false"
      @register="registerForm"
      @submit="handleSubmit"
    >
      <template #status="{ model }">
        <ElRadioGroup v-model="model.status">
          <ElRadio :label="1">{{ t('common.basic.enable') }}</ElRadio>
          <ElRadio :label="0">{{ t('common.basic.disabled') }}</ElRadio>
        </ElRadioGroup>
      </template>
      <template #type="{ model }">
        <ElSelect v-model="model.type" class="w-full">
          <ElOption :label="t('views.system.dept.deptTypeCompany')" :value="1" />
          <ElOption :label="t('views.system.dept.deptTypeSubsidiary')" :value="2" />
          <ElOption :label="t('views.system.dept.deptTypeDepartment')" :value="3" />
        </ElSelect>
      </template>
    </BasicForm>
  </BasicDialog>
</template>

<script setup lang="ts">
import { FormSchema, useForm } from '/@/components/Form'
import type { DeptResult } from '/@/api/system/dept.api'

import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { useTransl } from '/@/composables/core/useTransl'
import { BasicForm } from '/@/components/Form'
import { ref } from 'vue'
import { useAddDeptRequest, useUpdateDeptRequest } from '/@/api/system/dept.api'

const emit = defineEmits(['register', 'success'])

const { t } = useTransl()

const updateDeptId = ref<number | null>(null)

const [registerForm, { updateSchema, submit, setProps: setFormProps, setFormModel }] = useForm()
const [registerDialog, { setProps, closeDialog }] = useDialogInner(
  (data: { list: DeptResult[]; item: DeptResult }) => {
    const deptTree = [
      {
        id: 0,
        name: '#',
        children: data.list || [],
      },
    ]

    updateSchema({
      prop: 'parentId',
      componentProps: {
        data: deptTree,
      },
    })

    // is update?
    if (data.item) {
      updateDeptId.value = data.item.id
      setFormModel(data.item)
    } else {
      updateDeptId.value = null
    }
  }
)

const [addDeptRequest, _] = useAddDeptRequest()
const [updateDeptRequest, __] = useUpdateDeptRequest()

async function handleSubmit(res: Omit<DeptResult, 'id'>) {
  try {
    setFormProps({ disabled: true })
    setProps({ confirmBtnProps: { loading: true } })

    if (updateDeptId.value === null) {
      await addDeptRequest(res)
    } else {
      await updateDeptRequest({
        ...res,
        id: updateDeptId.value,
      })
    }

    closeDialog()

    emit('success')
  } finally {
    setFormProps({ disabled: false })
    setProps({ confirmBtnProps: { loading: false } })
  }
}

const schemas = ref<FormSchema[]>([
  {
    label: t('views.system.dept.name'),
    defaultValue: '',
    prop: 'name',
    colProps: {
      span: 12,
    },
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: `${t('component.form.enter')}${t('views.system.dept.name')}`,
    },
  },
  {
    label: t('views.system.dept.code'),
    defaultValue: '',
    prop: 'uniqueKey',
    component: 'ElInput',
    colProps: {
      span: 12,
    },
    rules: {
      required: true,
      type: 'string',
      message: `${t('component.form.enter')}${t('views.system.dept.code')}`,
    },
  },
  {
    label: t('views.system.dept.editform.parent'),
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
        label: (data: DeptResult): string => {
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
    label: t('views.system.dept.type'),
    defaultValue: 1,
    prop: 'type',
    slot: 'type',
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.system.dept.fullname'),
    defaultValue: '',
    prop: 'fullName',
    component: 'ElInput',
    colProps: {
      span: 12,
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
    label: t('common.basic.status'),
    defaultValue: 1,
    prop: 'status',
    slot: 'status',
    colProps: {
      span: 12,
    },
  },
  {
    label: t('common.basic.sort'),
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
])
</script>
