<template>
  <BasicForm
    class="w-[450px] mt-4 ml-6"
    :show-reset-button="false"
    :show-submit-button="false"
    :schemas="profileSchemas"
    label-position="top"
    @register="registerForm"
    @submit="handleSubmit"
  >
    <template #submitBefore>
      <ElButton type="success" @click="submit">更新密码</ElButton>
    </template>
  </BasicForm>
</template>

<script setup lang="ts">
import type { FormSchema } from '/@/components/Form'

import { BasicForm, useForm } from '/@/components/Form'

import { ref } from 'vue'
import { updateUserPasswd } from '/@/api/user'
import { useMessage } from '/@/composables/web/useMessage'

const [registerForm, { submit, setProps, getFieldsValue, resetFields }] = useForm()

const { createMessage } = useMessage()

async function handleSubmit(res: any) {
  try {
    setProps({ disabled: true })
    await updateUserPasswd({
      oldPassword: res.oldPassword,
      newPassword: res.newPassword,
    })

    // reset
    resetFields()

    createMessage({
      type: 'success',
      message: '密码已修改',
    })
  } finally {
    setProps({ disabled: false })
  }
}

const profileSchemas = ref<FormSchema[]>([
  {
    prop: 'oldPassword',
    label: '旧密码',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      min: 6,
      max: 12,
      message: '请输入旧密码,长度6-12位',
      trigger: 'blur',
    },
  },
  {
    prop: 'newPassword',
    label: '新密码',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      min: 6,
      max: 12,
      message: '请输入新密码,长度6-12位',
      trigger: 'blur',
    },
  },
  {
    prop: 'confirmNewPassword',
    label: '确认密码',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      trigger: 'blur',
      validator: (_, value: string, cb: Fn) => {
        if (value !== getFieldsValue().newPassword) {
          cb(new Error('二次确认密码不一致'))
        } else {
          cb()
        }
      },
    },
  },
])
</script>
