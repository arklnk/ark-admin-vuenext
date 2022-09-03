<template>
  <BasicDialog @register="registerDialog" @confirm="submit" :title="getTitle" width="30%">
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
import { computed, ref } from 'vue'
import { updateUserPwdRequest } from '/@/api/system/user'

defineEmits(['register'])

const updateUserId = ref<number | null>(null)
const updateUserAccount = ref('')

const getTitle = computed(() => `更改${updateUserAccount.value}密码`)

const [registerForm, { submit, setProps: setFormProps }] = useForm()
const [registerDialog, { setProps: setDialogProps, closeDialog }] = useDialogInner(
  (data: { id: number; account: string }) => {
    if (data?.id) {
      updateUserId.value = data.id
      updateUserAccount.value = data.account
    } else {
      closeDialog()
    }
  }
)

async function handleSubmit(res: Recordable) {
  try {
    setDialogProps({ confirmBtnProps: { loading: true } })
    setFormProps({ disabled: true })

    await updateUserPwdRequest({
      id: updateUserId.value!,
      password: res.password,
    })

    closeDialog()
  } finally {
    setDialogProps({ confirmBtnProps: { loading: false } })
    setFormProps({ disabled: false })
  }
}

const schemas = ref<FormSchema[]>([
  {
    label: '新密码',
    prop: 'password',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      min: 6,
      max: 12,
      message: '请输入新密码,长度6-12位',
    },
  },
])
</script>
