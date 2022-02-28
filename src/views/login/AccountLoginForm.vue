<template>
  <ElForm
    ref="formRef"
    label-width="0px"
    :model="formData"
    :rules="formRules"
    :disabled="isLogging"
  >
    <ElFormItem prop="username">
      <ElInput size="default" v-model="formData.username" placeholder="用户名" />
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput
        size="default"
        v-model="formData.password"
        placeholder="密码"
        show-password
        type="password"
      />
    </ElFormItem>
    <ElFormItem prop="verifyCode">
      <div class="w-full relative flex">
        <ElInput
          size="default"
          class="flex-1"
          v-model="formData.verifyCode"
          placeholder="验证码"
          @keyup.enter="handleLogin"
        />
        <ElImage
          class="h-8 w-20 ml-2 cursor-pointer bg-gray-200"
          :src="captchaData"
          fit="fill"
          @click="handleGetImageCaptcha"
        />
      </div>
    </ElFormItem>
    <ElFormItem>
      <ElButton
        size="default"
        :loading="isLogging"
        class="w-full mt-3"
        type="primary"
        @click="handleLogin"
      >登录</ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
import type { FormItemRule } from 'element-plus/lib/components/form/src/form.type'
import type { ElForm } from 'element-plus'

import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isEmpty, throttle } from 'lodash-es'
import { getImageCaptcha, userLogin } from '/@/api/login'
import { useUserStore } from '/@/stores/modules/user'
import { PageEnum } from '/@/enums/pageEnum'

const formData = reactive({
  username: '',
  password: '',
  verifyCode: '',
  captchaId: ''
})

/**
 * login
 */
const isLogging = ref(false)
type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()
const userStore = useUserStore()
const router = useRouter()
const handleLogin = throttle(() => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        isLogging.value = true
        const { data } = await userLogin(formData)
        if (data && !isEmpty(data.token)) {
          // logging
          userStore.setToken(data.token)
          await router.replace(PageEnum.Root)
        }
      } finally {
        isLogging.value = false
      }
    } else {
      return false
    }
  })
}, 2000)

/**
 * get image captcha
 */
const captchaData = ref('')
const handleGetImageCaptcha = throttle(async () => {
  const { data } = await getImageCaptcha()
  formData.captchaId = data!.id
  captchaData.value = data!.img
  // 清空文本
  formData.verifyCode = ''
}, 1000)

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
      message: () => {
        if (isEmpty(formData.username)) {
          return '请输入用户名'
        } else {
          return '输入的用户名不合法'
        }
      }
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      type: 'string',
      min: 6,
      message: () => {
        if (isEmpty(formData.password)) {
          return '请输入密码'
        } else {
          return '输入的密码不合法'
        }
      }
    }
  ],
  verifyCode: [
    {
      required: true,
      trigger: 'blur',
      type: 'string',
      min: 4,
      max: 4,
      message: () => {
        if (isEmpty(formData.verifyCode)) {
          return '请输入验证码'
        } else {
          return '输入的验证码不合法'
        }
      }
    }
  ]
})
</script>
