<template>
  <PageWrapper :content-background="false" content-full-height fixed-height>
    <div class="flex flex-row h-full relative">
      <div class="mr-2 h-full w-[320px] bg-comp">
        <BasicTable
          class="h-full"
          :pagination="false"
          highlight-current-row
          container-height-fixed
          :table-setting="{ fullscreen: false }"
          :show-table-setting="true"
          :api="getDeptListRequest"
          row-key="id"
          :show-header="false"
          @current-change="handleDeptChange"
          @register="registerDeptTable"
          :columns="createDeptColumns()"
        >
          <template #toolbar>
            <span class="ml-1 text-sm">部门架构</span>
          </template>
        </BasicTable>
      </div>
      <div class="flex-1 h-full w-0 bg-comp">
        <BasicTable
          class="h-full"
          container-height-fixed
          :api="processUserListRequest"
          @register="registerUserTable"
          :immediate="false"
          row-key="id"
          :columns="createUserColumns()"
        >
          <template #toolbar>
            <ElButton
              type="primary"
              @click="openEditUserFormDialog()"
              :disabled="!hasPermission(Api.add)"
            >
              新增
            </ElButton>
          </template>

          <template #roles="{ row }">
            <ElTag class="mr-1 mt-0.75" v-for="role in row.roles" :key="role.id" type="success">
              {{ role.name }}
            </ElTag>
          </template>

          <template #action="{ row }">
            <BasicTableAction
              :actions="[
                {
                  label: '编辑',
                  onClick: openEditUserFormDialog.bind(null, row),
                  disabled: !hasPermission(Api.update),
                },
              ]"
              :dropdown-actions="[
                {
                  label: '更改密码',
                  onClick: handleUpdatePwd.bind(null, row),
                  disabled: !hasPermission(Api.pwd),
                },
                {
                  label: '删除',
                  popconfirm: true,
                  type: 'danger',
                  onClick: handleDelete.bind(null, row),
                  disabled: !hasPermission(Api.delete),
                },
              ]"
            />
          </template>
        </BasicTable>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { UserRequestParams } from '/@/api/system/user'
import type { FormSchema } from '/@/components/Form'

import { getDeptListRequest } from '/@/api/system/dept'
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable, BasicTableAction } from '/@/components/Table'
import { nextTick, onMounted, ref } from 'vue'
import {
  getUserPageRequest,
  deleteUserRequest,
  updateUserPwdRequest,
  getRDPJInfoRequest,
  addUserRequest,
  updateUserRequest,
  Api,
} from '/@/api/system/user'
import { usePermission } from '/@/composables/core/usePermission'
import { createFormDialog } from '/@/components/Form'
import { createDeptColumns, createUserColumns } from './columns'
import { createUserSchemas, createUpdatePwdSchemas } from './schemas'
import { listToTree } from '/@/utils/helper/tree'

const { hasPermission } = usePermission()

const [registerDeptTable, { getCurrentRow }] = useTable()
const [registerUserTable, { reload }] = useTable()

const updateUserId = ref<number | null>(null)

const fdInstance = createFormDialog({
  dialogProps: { title: '编辑用户信息' },
  formProps: { labelWidth: '100px', schemas: createUserSchemas() },
  submit: async (res: UserRequestParams, { showLoading, hideLoading, close }) => {
    try {
      showLoading()

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

      close()

      reload()
    } finally {
      hideLoading()
    }
  },
})

function openEditUserFormDialog(update?: Recordable) {
  fdInstance.open(async ({ showLoading, close, getFormAction, hideLoading }) => {
    // 请求当前角色所拥有的角色权限、以及部门、岗位、职称列表信息
    try {
      showLoading()
      const { role, dept, profession, job } = await getRDPJInfoRequest({
        userId: update ? update.id : 0,
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
        {
          prop: 'account',
          disabled: !!update,
        },
      ]
      getFormAction()?.updateSchema(updateSchemas)
    } catch (e) {
      close()
    } finally {
      hideLoading()
    }

    // is update?
    if (update) {
      const item = update

      getFormAction()?.setFormModel({
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
  })
}

// User
async function processUserListRequest(params: any) {
  return await getUserPageRequest({
    ...params,
    deptId: getCurrentRow()?.id || 0,
  })
}

async function handleDelete(row: Recordable) {
  await deleteUserRequest({ id: row.id })
  reload()
}

function handleDeptChange() {
  nextTick(() => {
    reload({ page: 1 })
  })
}

function handleUpdatePwd(row: Recordable) {
  createFormDialog({
    dialogProps: {
      title: `更改账号${row.account}的密码`,
      width: '30%',
      canFullscreen: false,
    },
    formProps: {
      schemas: createUpdatePwdSchemas(),
    },
    submit: async (res, { showLoading, close, hideLoading }) => {
      try {
        showLoading()

        await updateUserPwdRequest({
          id: row.id,
          password: res.password,
        })

        close()
      } finally {
        hideLoading()
      }
    },
  }).open()
}

onMounted(() => {
  reload()
})
</script>
