<template>
  <ElForm ref="formRef" label-width="0px" :model="formData" :rules="formRules">
    <ElFormItem prop="username">
      <ElInput v-model="formData.username" placeholder="用户名" />
    </ElFormItem>
    <ElFormItem prop="passwrod">
      <ElInput v-model="formData.passwrod" placeholder="密码" />
    </ElFormItem>
    <ElFormItem prop="verifyCode">
      <div class="w-full relative flex">
        <ElInput class="flex-1" v-model="formData.verifyCode" placeholder="验证码" />
        <ElImage class="h-8 w-20 ml-2 cursor-pointer bg-gray-200" :src="captchaData" fit="fill" @click="handleGetImageCaptcha" />
      </div>
    </ElFormItem>
    <ElFormItem>
      <ElButton :loading="loading" class="w-full mt-2" type="primary" @click="handleLogin">登录</ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
import type { FormItemRule } from 'element-plus/lib/components/form/src/form.type'
import { reactive, ref } from 'vue'
import { getImageCaptcha } from '/@/api/login'

const formData = reactive({
  username: '',
  passwrod: '',
  verifyCode: '',
  captchaId: '',
})

/**
 * login
 */
const loading = ref(false)
const formRef = ref(null)
async function handleLogin() {}

/**
 * get image captcha
 */
const captchaData = ref('')
async function handleGetImageCaptcha() {
  const { data } = await getImageCaptcha()
  formData.captchaId = data!.id
  captchaData.value = data!.img
}
// init
handleGetImageCaptcha()

/**
 * form config
 */
const formRules = reactive<Partial<Record<string, FormItemRule | FormItemRule[]>>>({
  username: [
    {
      required: true,
      trigger: 'blur',
      type: 'string',
      min: 4,
      message: '请输入用户名',
    },
  ],
  passwrod: [
    {
      required: true,
      trigger: 'blur',
      type: 'string',
      min: 6,
      message: '请输入密码',
    },
  ],
  verifyCode: [
    {
      required: true,
      trigger: 'blur',
      type: 'string',
      min: 4,
      max: 4,
      message: '请输入验证码',
    },
  ],
})
</script>
