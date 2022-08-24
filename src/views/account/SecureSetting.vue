<template>
  <BasicForm
    class="w-[450px] mt-4 ml-6"
    :show-reset-button="false"
    :show-submit-button="false"
    :schemas="profileSchemas"
    label-position="top"
    @register="registerForm"
  >
    <template #submitBefore>
      <ElButton type="success">更新密码</ElButton>
    </template>
  </BasicForm>
</template>

<script setup lang="ts">
import type { FormSchema } from '/@/components/Form'

import { BasicForm, useForm } from '/@/components/Form'

import { ref } from 'vue'

const [registerForm] = useForm()

const profileSchemas = ref<FormSchema[]>([
  {
    prop: 'oldPassword',
    label: '旧密码',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入旧密码',
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
      message: '请输入新密码',
    },
  },
  {
    prop: 'confirmNewPassword',
    label: '确认密码',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请再次输入新密码',
    },
  },
])
</script>
