<template>
  <BasicDialog @register="registerDialog" @confirm="submit" title="编辑用户信息">
    <BasicForm
      :schemas="schemas"
      :show-action-button-group="false"
      @submit="handleSubmit"
      @register="registerForm"
      label-width="100px"
    >
      <template #gender="{ model }">
        <ElSelect v-model="model.gender" class="w-full">
          <ElOption label="保密" :value="0" />
          <ElOption label="女" :value="1" />
          <ElOption label="男" :value="2" />
        </ElSelect>
      </template>

      <template #status="{ model }">
        <ElRadioGroup v-model="model.status">
          <ElRadio :label="1">启用</ElRadio>
          <ElRadio :label="0">禁用</ElRadio>
        </ElRadioGroup>
      </template>
    </BasicForm>
  </BasicDialog>
</template>

<script setup lang="ts">
import type { FormSchema } from '/@/components/Form'
import type { UserRequestParams, UserResult } from '/@/api/system/user'

import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import { ref } from 'vue'
import { listToTree } from '/@/utils/helper/tree'
import { addUserRequest, updateUserRequest, getRDPJInfoRequest } from '/@/api/system/user'

const emit = defineEmits(['register', 'success'])

const updateUserId = ref<number | null>(null)

const [registerForm, { submit, setProps: setFormProps, updateSchema, setFormModel }] = useForm()
const [registerDialog, { setProps: setDialogProps, closeDialog }] = useDialogInner(
  async (data: { item?: UserResult }) => {
    // 请求当前角色所拥有的角色权限、以及部门、岗位、职称列表信息
    try {
      setDialogProps({ loading: true })
      const { role, dept, profession, job } = await getRDPJInfoRequest({
        userId: data?.item ? data.item.id : 0,
      })

      const updateSchemas: FormSchema[] = [
        {
          prop: 'deptId',
          componentProps: {
            data: listToTree(dept),
          },
        },
        {
          prop: 'roleIds',
          componentProps: {
            data: listToTree(role),
          },
        },
        {
          prop: 'jobId',
          componentProps: {
            data: job,
          },
        },
        {
          prop: 'professionId',
          componentProps: {
            data: profession,
          },
        },
      ]
      updateSchema(updateSchemas)
    } catch (e) {
      closeDialog()
    } finally {
      setDialogProps({ loading: false })
    }

    // is update?
    if (data.item) {
      const item = data.item

      setFormModel({
        ...item,
        jobId: item.job.id,
        professionId: item.profession.id,
        deptId: item.dept.id,
        roleIds: item.roles.map((e) => e.id),
      } as UserRequestParams)

      updateUserId.value = item.id
    } else {
      updateUserId.value = null
    }
  }
)

async function handleSubmit(res: UserRequestParams) {
  try {
    setDialogProps({ confirmBtnProps: { loading: true } })
    setFormProps({ disabled: true })

    // set default
    res.avatar = ''

    if (updateUserId.value === null) {
      await addUserRequest(res)
    } else {
      await updateUserRequest({
        ...res,
        id: updateUserId.value,
      })
    }

    closeDialog()

    emit('success')
  } finally {
    setDialogProps({ confirmBtnProps: { loading: false } })
    setFormProps({ disabled: false })
  }
}

const schemas = ref<FormSchema[]>([
  {
    label: '账号',
    prop: 'account',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入账号',
    },
    disabled: () => {
      return updateUserId.value !== null
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '姓名',
    prop: 'username',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入姓名',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '性别',
    prop: 'gender',
    defaultValue: 0,
    slot: 'gender',
    colProps: {
      span: 12,
    },
  },
  {
    label: '昵称',
    prop: 'nickname',
    defaultValue: '',
    component: 'ElInput',
    colProps: {
      span: 12,
    },
  },
  {
    label: '邮箱',
    prop: 'email',
    defaultValue: '',
    component: 'ElInput',
    colProps: {
      span: 12,
    },
  },
  {
    label: '手机号',
    prop: 'mobile',
    defaultValue: '',
    component: 'ElInput',
    colProps: {
      span: 12,
    },
  },
  {
    label: '所属角色',
    prop: 'roleIds',
    defaultValue: [],
    component: 'ElTreeSelect',
    componentProps: {
      data: [],
      multiple: true,
      style: 'width: 100%;',
      checkStrictly: true,
      showCheckbox: true,
      nodeKey: 'id',
      renderAfterExpand: false,
      props: {
        label: (data: Recordable): string => {
          return data.name
        },
        disabled: (data: Recordable): boolean => {
          // has为0，禁止删除
          return data.has === 0
        },
      },
    },
    rules: {
      required: true,
      type: 'array',
      min: 1,
      message: '请选择所属角色',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '所属部门',
    prop: 'deptId',
    component: 'ElTreeSelect',
    componentProps: {
      data: [],
      style: 'width: 100%;',
      checkStrictly: true,
      nodeKey: 'id',
      renderAfterExpand: false,
      props: {
        label: (data: Recordable): string => {
          return data.name
        },
      },
    },
    rules: {
      required: true,
      type: 'number',
      min: 1,
      message: '请选择所属部门',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '职称',
    prop: 'professionId',
    component: 'ElTreeSelect',
    componentProps: {
      data: [],
      style: 'width: 100%;',
      checkStrictly: true,
      nodeKey: 'id',
      props: {
        label: (data: Recordable): string => {
          return data.name
        },
      },
    },
    rules: {
      required: true,
      type: 'number',
      min: 1,
      message: '请选择职称',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '岗位',
    prop: 'jobId',
    component: 'ElTreeSelect',
    componentProps: {
      data: [],
      style: 'width: 100%;',
      checkStrictly: true,
      nodeKey: 'id',
      props: {
        label: (data: Recordable): string => {
          return data.name
        },
      },
    },
    rules: {
      required: true,
      type: 'number',
      min: 1,
      message: '请选择岗位',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '排序',
    prop: 'orderNum',
    defaultValue: 0,
    component: 'ElInputNumber',
    componentProps: {
      min: 0,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '状态',
    defaultValue: 1,
    prop: 'status',
    slot: 'status',
    colProps: {
      span: 12,
    },
  },
  {
    label: '备注',
    prop: 'remark',
    defaultValue: '',
    component: 'ElInput',
    componentProps: {
      type: 'textarea',
      rows: 2,
    },
  },
])
</script>
