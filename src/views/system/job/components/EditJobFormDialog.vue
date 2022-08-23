<template>
  <BasicDialog @register="registerDialog" @confirm="submit" title="编辑岗位信息">
    <BasicForm
      :schemas="schemas"
      :show-action-button-group="false"
      label-width="100px"
      @submit="handleSubmit"
      @register="registerForm"
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
import type { JobResult } from '/@/api/system/job.api'

import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import { ref } from 'vue'
import { useAddJobRequest, useUpdateJobRequest } from '/@/api/system/job.api'

const emit = defineEmits(['register', 'success'])

const updateJobId = ref<number | null>(null)

const [registerForm, { submit, setProps: setFormProps, setFormModel }] = useForm()
const [registerDialog, { setProps: setDialogProps, closeDialog }] = useDialogInner(
  (data: { item: JobResult }) => {
    // is update?
    if (data.item) {
      updateJobId.value = data.item.id
      setFormModel(data.item)
    } else {
      updateJobId.value = null
    }
  }
)

const [addJobRequest, _] = useAddJobRequest()
const [updateJobRequest, __] = useUpdateJobRequest()

async function handleSubmit(res: Omit<JobResult, 'id'>) {
  try {
    setDialogProps({ confirmBtnProps: { loading: true } })
    setFormProps({ disabled: true })

    if (updateJobId.value === null) {
      await addJobRequest(res)
    } else {
      await updateJobRequest({
        ...res,
        id: updateJobId.value,
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
    label: '岗位名称',
    prop: 'name',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入岗位名称',
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
