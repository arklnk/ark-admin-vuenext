<template>
  <BasicDialog
    @register="registerDialog"
    @confirm="submit"
    :title="t('views.system.user.editform.title')"
    @visible-change="handleVisibleChange"
  >
    <BasicForm
      :schemas="schemas"
      :show-action-button-group="false"
      @submit="handleSubmit"
      @register="registerForm"
      label-width="100px"
    >
      <template #gender="{ model }">
        <ElSelect v-model="model.gender" class="w-full">
          <ElOption :label="t('common.basic.secrecy')" :value="0" />
          <ElOption :label="t('common.basic.female')" :value="1" />
          <ElOption :label="t('common.basic.male')" :value="2" />
        </ElSelect>
      </template>

      <template #status="{ model }">
        <ElRadioGroup v-model="model.status">
          <ElRadio :label="1">{{ t('common.basic.enable') }}</ElRadio>
          <ElRadio :label="0">{{ t('common.basic.disabled') }}</ElRadio>
        </ElRadioGroup>
      </template>
    </BasicForm>
  </BasicDialog>
</template>

<script setup lang="ts">
import type { FormSchema } from '/@/components/Form'
import type { UserRequestParams, UserResult } from '/@/api/system/user.api'

import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import { useTransl } from '/@/composables/core/useTransl'
import { ref, nextTick } from 'vue'
import { useGetRoleListRequest } from '/@/api/system/role.api'
import { useGetDeptListRequest } from '/@/api/system/dept.api'
import { useGetProfListRequest } from '/@/api/system/profession.api'
import { useGetJobListRequest } from '/@/api/system/job.api'
import { listToTree } from '/@/utils/helper/tree'
import { useAddUserRequest, useUpdateUserRequest } from '/@/api/system/user.api'

const emit = defineEmits(['register', 'success'])

const { t } = useTransl()

const [addUserRequest, _] = useAddUserRequest()
const [updateUserRequest, __] = useUpdateUserRequest()

const updateUserId = ref<number | null>(null)

const [registerForm, { submit, setProps: setFormProps, updateSchema, setFormModel }] = useForm()
const [registerDialog, { setProps: setDialogProps, closeDialog }] = useDialogInner(
  (data: { item?: UserResult }) => {
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

const [getRoleListRequest] = useGetRoleListRequest()
const [getDeptListRequest] = useGetDeptListRequest()
const [getProfListRequest] = useGetProfListRequest()
const [getJobListRequest] = useGetJobListRequest()

function handleVisibleChange(visible: boolean) {
  if (!visible) return

  nextTick(async () => {
    try {
      setDialogProps({ loading: true })
      const [roles, depts, profs, jobs] = await Promise.all([
        getRoleListRequest(),
        getDeptListRequest(),
        getProfListRequest(),
        getJobListRequest(),
      ])

      const updateSchemas: FormSchema[] = [
        {
          prop: 'deptId',
          componentProps: {
            data: listToTree(depts.list),
          },
        },
        {
          prop: 'roleIds',
          componentProps: {
            data: listToTree(roles.list),
          },
        },
        {
          prop: 'jobId',
          componentProps: {
            data: jobs.list,
          },
        },
        {
          prop: 'professionId',
          componentProps: {
            data: profs.list,
          },
        },
      ]
      updateSchema(updateSchemas)
    } catch (e) {
      closeDialog()
    } finally {
      setDialogProps({ loading: false })
    }
  })
}

const schemas = ref<FormSchema[]>([
  {
    label: t('views.system.user.account'),
    prop: 'account',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: `${t('component.form.enter')}${t('views.system.user.account')}`,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.system.user.username'),
    prop: 'username',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: `${t('component.form.enter')}${t('views.system.user.username')}`,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.system.user.gender'),
    prop: 'gender',
    defaultValue: 0,
    slot: 'gender',
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.system.user.nickname'),
    prop: 'nickname',
    defaultValue: '',
    component: 'ElInput',
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.system.user.email'),
    prop: 'email',
    defaultValue: '',
    component: 'ElInput',
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.system.user.mobile'),
    prop: 'mobile',
    defaultValue: '',
    component: 'ElInput',
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.system.user.roles'),
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
          return t(data.name)
        },
      },
    },
    rules: {
      required: true,
      type: 'array',
      min: 1,
      message: `${t('component.form.choose')}${t('views.system.user.roles')}`,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.system.user.dept'),
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
          return t(data.name)
        },
      },
    },
    rules: {
      required: true,
      type: 'number',
      min: 1,
      message: `${t('component.form.choose')}${t('views.system.user.dept')}`,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.system.user.profession'),
    prop: 'professionId',
    component: 'ElTreeSelect',
    componentProps: {
      data: [],
      style: 'width: 100%;',
      checkStrictly: true,
      nodeKey: 'id',
      props: {
        label: (data: Recordable): string => {
          return t(data.name)
        },
      },
    },
    rules: {
      required: true,
      type: 'number',
      min: 1,
      message: `${t('component.form.choose')}${t('views.system.user.profession')}`,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.system.user.job'),
    prop: 'jobId',
    component: 'ElTreeSelect',
    componentProps: {
      data: [],
      style: 'width: 100%;',
      checkStrictly: true,
      nodeKey: 'id',
      props: {
        label: (data: Recordable): string => {
          return t(data.name)
        },
      },
    },
    rules: {
      required: true,
      type: 'number',
      min: 1,
      message: `${t('component.form.choose')}${t('views.system.user.job')}`,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: t('common.basic.sort'),
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
    label: t('common.basic.status'),
    defaultValue: 1,
    prop: 'status',
    slot: 'status',
    colProps: {
      span: 12,
    },
  },
  {
    label: t('common.basic.remark'),
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
