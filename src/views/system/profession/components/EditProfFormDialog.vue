<template>
  <BasicDialog @register="registerDialog" @confirm="submit" title="编辑职称信息">
    <BasicForm
      :schemas="schemas"
      :show-action-button-group="false"
      @submit="handleSubmit"
      @register="registerForm"
      label-width="100px"
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
import type { ProfessionResult } from '/@/api/system/profession'

import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import { ref } from 'vue'
import { addProfRequest, updateProfRequest } from '/@/api/system/profession'

const emit = defineEmits(['register', 'success'])

const updateProfId = ref<number | null>(null)

const [registerForm, { submit, setProps: setFormProps, setFormModel }] = useForm()
const [registerDialog, { setProps: setDialogProps, closeDialog }] = useDialogInner(
  (data: { item: ProfessionResult }) => {
    // is update?
    if (data.item) {
      setFormModel(data.item)
      updateProfId.value = data.item.id
    } else {
      updateProfId.value = null
    }
  }
)

async function handleSubmit(res: Omit<ProfessionResult, 'id'>) {
  try {
    setDialogProps({ confirmBtnProps: { loading: true } })
    setFormProps({ disabled: true })

    if (updateProfId.value === null) {
      await addProfRequest(res)
    } else {
      await updateProfRequest({
        ...res,
        id: updateProfId.value,
      })
    }

    closeDialog()

    emit('success')
  } finally {
    setDialogProps({ confirmBtnProps: { loading: false } })
    setFormProps({ disabled: false })
  }
}

const schemas = ref<FormSchema[]>([
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
    slot: 'status',
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
])
</script>
