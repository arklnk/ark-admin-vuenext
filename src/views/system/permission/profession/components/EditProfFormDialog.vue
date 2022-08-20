<template>
  <BasicDialog
    @register="registerDialog"
    @confirm="submit"
    :title="t('views.system.profession.editform.title')"
  >
    <BasicForm
      :schemas="schemas"
      :show-action-button-group="false"
      @submit="handleSubmit"
      @register="registerForm"
      label-width="100px"
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
import type { ProfessionResult } from '/@/api/system/profession.api'

import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import { useTransl } from '/@/composables/core/useTransl'
import { ref } from 'vue'
import { useAddProfRequest, useUpdateProfRequest } from '/@/api/system/profession.api'

const emit = defineEmits(['register', 'success'])

const { t } = useTransl()

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

const [addProfRequest, _] = useAddProfRequest()
const [updateProfRequest, __] = useUpdateProfRequest()

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
    label: t('views.system.profession.name'),
    prop: 'name',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: `${t('component.form.enter')}${t('views.system.profession.name')}`,
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
