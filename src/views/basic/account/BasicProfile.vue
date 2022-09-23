<template>
  <BasicForm
    class="w-[450px] mt-4 ml-6"
    @register="registerForm"
    @submit="handleSubmit"
    :show-reset-button="false"
    :show-submit-button="false"
    label-position="top"
    :schemas="schemas"
  >
    <template #submitBefore>
      <ElButton type="primary" @click="submit">更新信息</ElButton>
    </template>

    <template #gender="{ model }">
      <ElSelect v-model="model.gender">
        <ElOption label="保密" :value="0" />
        <ElOption label="女" :value="1" />
        <ElOption label="男" :value="2" />
      </ElSelect>
    </template>

    <template #avatar="{ model }">
      <div class="flex flex-row items-center">
        <ElAvatar :size="80" :src="model.avatar" />
        <ElButton class="ml-4" @click="handleGenAvatar">生成头像</ElButton>
      </div>
    </template>
  </BasicForm>
</template>

<script setup lang="ts">
import type { FormSchema } from '/@/components/Form'

import { BasicForm, useForm } from '/@/components/Form'
import { onMounted, ref } from 'vue'
import { getUserProfileInfo, updateUserProfile, generateAvatar } from '/@/api/basic'
import { useUserStore } from '/@/stores/modules/user'

const [registerForm, { setFormModel, submit, setProps }] = useForm()

const loadingRef = ref(false)

async function getProfileInfo() {
  try {
    loadingRef.value = true
    const result = await getUserProfileInfo()
    setFormModel(result)
  } finally {
    loadingRef.value = false
  }
}

const userStore = useUserStore()

async function handleSubmit(res: any) {
  try {
    setProps({ disabled: true })
    await updateUserProfile(res)

    // update store
    userStore.updateUserInfo({
      username: res.username,
      avatar: res.avatar,
    })
  } finally {
    setProps({ disabled: false })
  }
}

async function handleGenAvatar() {
  const { avatarUrl = '' } = await generateAvatar()
  setFormModel({
    avatar: avatarUrl,
  })
}

onMounted(() => {
  getProfileInfo()
})

const schemas = ref<FormSchema[]>([
  {
    prop: 'avatar',
    label: '头像',
    defaultValue: '',
    slot: 'avatar',
  },
  {
    prop: 'username',
    label: '姓名',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入姓名',
    },
  },
  {
    prop: 'nickname',
    label: '昵称',
    defaultValue: '',
    component: 'ElInput',
  },
  {
    prop: 'gender',
    label: '性别',
    defaultValue: 0,
    slot: 'gender',
  },
  {
    prop: 'email',
    label: '邮箱',
    defaultValue: '',
    component: 'ElInput',
  },
  {
    prop: 'mobile',
    label: '手机号',
    defaultValue: '',
    component: 'ElInput',
  },
])
</script>
