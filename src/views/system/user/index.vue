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
                  onClick: openPwdDialog.bind(null, row),
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

    <EditUserFormDialog @register="registerDialog" @success="reload" />

    <EditPwdFormDialog @register="registerPwdDialog" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { UserResult } from '/@/api/system/user'

import { getDeptListRequest } from '/@/api/system/dept'
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable, BasicTableAction } from '/@/components/Table'
import { nextTick } from 'vue'
import { getUserPageRequest, deleteUserRequest, Api } from '/@/api/system/user'
import EditUserFormDialog from './components/EditUserFormDialog.vue'
import EditPwdFormDialog from './components/EditPwdFormDialog.vue'
import { useDialog } from '/@/components/Dialog'
import { usePermission } from '/@/composables/core/usePermission'

const { hasPermission } = usePermission()

const [registerDeptTable, { getCurrentRow }] = useTable({
  columns: [
    {
      label: '部门名称',
      prop: 'name',
    },
  ],
})
const [registerUserTable, { reload }] = useTable({
  columns: [
    {
      label: '账号',
      prop: 'account',
      align: 'center',
      width: 160,
    },
    {
      label: '姓名',
      prop: 'username',
      align: 'center',
      width: 160,
    },
    {
      label: '所属部门',
      prop: 'dept',
      align: 'center',
      width: 180,
      formatter: (row: UserResult) => {
        return row.dept.name
      },
    },
    {
      label: '所属角色',
      prop: 'roles',
      align: 'center',
      width: 240,
      slot: 'roles',
    },
    {
      label: '职称',
      prop: 'profession',
      align: 'center',
      width: 180,
      formatter: (row: UserResult) => {
        return row.profession.name
      },
    },
    {
      label: '岗位',
      prop: 'job',
      align: 'center',
      width: 180,
      formatter: (row: UserResult) => {
        return row.job.name
      },
    },
    {
      label: '性别',
      align: 'center',
      prop: 'gender',
      width: 120,
      formatter: (row: UserResult) => {
        if (row.gender === 1) {
          return '女'
        } else if (row.gender === 2) {
          return '难'
        } else {
          return '保密'
        }
      },
    },
    {
      label: '手机号',
      prop: 'mobile',
      align: 'center',
      width: 180,
    },
    {
      label: '昵称',
      prop: 'nickname',
      align: 'center',
      width: 160,
    },
    {
      label: '邮箱',
      prop: 'email',
      align: 'center',
      width: 180,
    },
    {
      label: '操作',
      align: 'center',
      width: 120,
      fixed: 'right',
      slot: 'action',
    },
  ],
})

const [registerDialog, { openDialog }] = useDialog()
const [registerPwdDialog, { openDialog: openPwdDialog }] = useDialog()

function openEditUserFormDialog(update?: Recordable) {
  openDialog({
    item: update,
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

nextTick(() => {
  reload()
})
</script>
