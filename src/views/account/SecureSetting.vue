<template>
  <BasicForm class="w-[450px] mt-4 ml-6" @register="registerForm" @submit="handleSubmit">
    <template #submitBefore>
      <ElButton type="primary" @click="submit">更新密码</ElButton>
    </template>
  </BasicForm>
</template>

<script setup lang="ts">
import { BasicForm, useForm } from '/@/components/Form'
import { updateUserPasswd } from '/@/api/user'
import { useMessage } from '/@/composables/web/useMessage'

const [registerForm, { submit, setProps, getFieldsValue, resetFields }] = useForm({
  showResetButton: false,
  showSubmitButton: false,
  labelPosition: 'top',
  schemas: [
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
          if (!value) {
            cb(new Error('请再次输入密码以确认'))
          } else if (value !== getFieldsValue().newPassword) {
            cb(new Error('二次确认密码不一致'))
          } else {
            cb()
          }
        },
      },
    },
  ],
})

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
</script>
