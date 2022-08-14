<template>
  <ElForm
    ref="formRef"
    label-width="0px"
    :model="formData"
    :rules="formRules"
    :disabled="isLogging"
  >
    <ElFormItem prop="username">
      <ElInput
        size="default"
        v-model="formData.username"
        :placeholder="t('routes.login.username')"
      />
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput
        size="default"
        v-model="formData.password"
        :placeholder="t('routes.login.passwd')"
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
          :placeholder="t('routes.login.captcha')"
          @keyup.enter="handleLogin"
        />
        <div class="h-8 w-20 ml-2 cursor-pointer select-none" @click="handleGetImageCaptcha">
          <ElImage
            class="w-full h-full"
            style="background-color: var(--el-fill-color-dark)"
            :src="captchaData"
            fit="fill"
          />
        </div>
      </div>
    </ElFormItem>
    <ElFormItem>
      <ElButton
        size="default"
        :loading="isLogging"
        class="w-full mt-3"
        type="primary"
        @click="handleLogin"
      >
        {{ t('routes.login.signin') }}
      </ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
import type { ElForm, FormItemRule } from 'element-plus'

import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { isEmpty, debounce } from 'lodash-es'
import { getImageCaptcha, userLogin } from '/@/api/login'
import { useUserStore } from '/@/stores/modules/user'
import { PageEnum } from '/@/enums/pageEnum'
import { useGo } from '/@/composables/web/useGo'
import { useI18n } from '/@/composables/core/useI18n'

const formData = reactive({
  username: '',
  password: '',
  verifyCode: '',
  captchaId: '',
})

const { t } = useI18n()

/**
 * login
 */
const isLogging = ref(false)
type FormInstance = InstanceType<typeof ElForm>
const formRef = ref<FormInstance>()
const userStore = useUserStore()
const go = useGo()
const $route = useRoute()
const handleLogin = debounce(() => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        isLogging.value = true
        const data = await userLogin(formData)
        if (data && !isEmpty(data.token)) {
          // logging
          userStore.setToken(data.token)

          if ($route.query.redirect) {
            go($route.query.redirect as string, true)
          } else {
            go(PageEnum.Root, true)
          }
        }
      } catch (err) {
        // nothing to do
      } finally {
        isLogging.value = false
      }
    } else {
      return false
    }
  })
}, 500)

/**
 * get image captcha
 */
const captchaData = ref('')
const handleGetImageCaptcha = debounce(async () => {
  try {
    const { id, img } = await getImageCaptcha()
    formData.captchaId = id
    captchaData.value = img
    // 清空文本
    formData.verifyCode = ''
  } catch (err) {}
}, 500)

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
      },
    },
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
      },
    },
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
      },
    },
  ],
})
</script>
