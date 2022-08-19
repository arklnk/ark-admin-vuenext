<template>
  <BasicDialog @register="registerDialog" @confirm="submit" :title="t('views.system.job.name')">
    <BasicForm
      :schemas="schemas"
      :show-action-button-group="false"
      @submit="handleSubmit"
      @register="registerForm"
    />
  </BasicDialog>
</template>

<script setup lang="ts">
import type { FormSchema } from '/@/components/Form'

import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import { useTransl } from '/@/composables/core/useTransl'
import { ref } from 'vue'

defineEmits(['register'])

const { t } = useTransl()

const [registerDialog] = useDialogInner()
const [registerForm, { submit }] = useForm()

async function handleSubmit(res: Recordable) {
  console.log(res)
}

const schemas = ref<FormSchema[]>([])
</script>
