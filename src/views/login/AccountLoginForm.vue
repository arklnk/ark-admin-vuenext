<template>
  <ElForm ref="formRef" label-width="0px" :model="form" :rules="rules" />
  <ElInput placeholder="请输入用户名" />
  <ElInput class="mt-4" placeholder="请输入密码" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  username: '',
  passwrod: '',
  verifyCode: '',
  captchaId: '',
})

const rules = reactive({
  username: [
    {
      required: true,
      trigger: 'blur',
      validator: (_: any, value: any, callback: any) => {
        if (value.length < 2) {
          callback(new Error('请输入合法的用户名'))
        } else {
          callback()
        }
      },
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: (_: any, value: any, callback: any) => {
        if (value.length < 6) {
          callback(new Error('密码不能少于6位'))
        } else {
          callback()
        }
      },
    },
  ],
  verifyCode: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule: any, value: any, callback: any) => {
        if (value.length !== 4) {
          callback(new Error('请输入合法的验证码'))
        } else {
          callback()
        }
      },
    },
  ],
})
</script>
