<template>
  <BasicDialog @register="registerDialog" @confirm="submit" :title="t('views.system.job.name')">
    <BasicForm
      :schemas="schemas"
      :show-action-button-group="false"
      label-width="100px"
      @submit="handleSubmit"
      @register="registerForm"
    >
      <template #status="{ model }">
        <ElRadioGroup v-model="model.status">
          <ElRadio :label="1">{{ t('common.basic.enable') }}</ElRadio>
          <ElRadio :label="0">{{ t('common.basic.disabled') }}</ElRadio>
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
import { useTransl } from '/@/composables/core/useTransl'
import { ref } from 'vue'
import { useAddJobRequest, useUpdateJobRequest } from '/@/api/system/job.api'

const emit = defineEmits(['register', 'success'])

const { t } = useTransl()

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
    label: t('views.system.job.name'),
    prop: 'name',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: `${t('component.form.enter')}${t('views.system.job.name')}`,
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
