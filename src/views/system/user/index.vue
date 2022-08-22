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
          :api="processDeptListResult"
          :columns="deptColumns"
          row-key="id"
          :show-header="false"
          @current-change="handleDeptChange"
          @register="registerDeptTable"
        >
          <template #toolbar>
            <span class="ml-1 text-sm">{{ t('views.system.user.deptStruct') }}</span>
          </template>
        </BasicTable>
      </div>
      <div class="flex-1 h-full w-0 bg-comp">
        <BasicTable
          class="h-full"
          container-height-fixed
          :columns="userColumns"
          :api="processUserListRequest"
          @register="registerUserTable"
          :immediate="false"
        >
          <template #toolbar>
            <ElButton type="primary" @click="openEditUserFormDialog()">{{
              t('common.basic.add')
            }}</ElButton>
          </template>
          <template #action="{ row }">
            <ElButton type="primary" link @click="openEditUserFormDialog(row)">{{
              t('common.basic.edit')
            }}</ElButton>
            <ElButton type="danger" link @click="handleDelete(row)">{{
              t('common.basic.delete')
            }}</ElButton>
          </template>
        </BasicTable>
      </div>
    </div>

    <EditUserFormDialog @register="registerDialog" @success="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { BasicColumn } from '/@/components/Table'
import type { UserResult } from '/@/api/system/user.api'

import { useGetDeptListRequest } from '/@/api/system/dept.api'
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { listToTree } from '/@/utils/helper/tree'
import { ref, nextTick } from 'vue'
import { useTransl } from '/@/composables/core/useTransl'
import { useGetUserListRequest, useDeleteUserRequest } from '/@/api/system/user.api'
import EditUserFormDialog from './components/EditUserFormDialog.vue'
import { useDialog } from '/@/components/Dialog'

const { t } = useTransl()

const [registerDeptTable, { getCurrentRow }] = useTable()
const [registerUserTable, { reload }] = useTable()

const [registerDialog, { openDialog }] = useDialog()

function openEditUserFormDialog(update?: Recordable) {
  openDialog({
    item: update,
  })
}

// User
const [getUserListRequest, __] = useGetUserListRequest()
const [deleteUserListRequest, ___] = useDeleteUserRequest()

async function processUserListRequest(params: any) {
  return await getUserListRequest({
    ...params,
    deptId: getCurrentRow()?.id || 0,
  })
}

async function handleDelete(row: Recordable) {
  await deleteUserListRequest({ id: row.id })
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

const userColumns = ref<BasicColumn[]>([
  {
    label: t('views.system.user.account'),
    prop: 'account',
    align: 'center',
    width: 160,
  },
  {
    label: t('views.system.user.username'),
    prop: 'username',
    align: 'center',
    width: 160,
  },
  {
    label: t('views.system.user.dept'),
    prop: 'dept',
    align: 'center',
    width: 180,
    formatter: (row: UserResult) => {
      return row.dept.name
    },
  },
  {
    label: t('views.system.user.roles'),
    prop: 'roles',
    align: 'center',
    width: 200,
    formatter: (row: UserResult) => {
      return row.roles.map((e) => e.name).join(',')
    },
  },
  {
    label: t('views.system.user.profession'),
    prop: 'profession',
    align: 'center',
    width: 180,
    formatter: (row: UserResult) => {
      return row.profession.name
    },
  },
  {
    label: t('views.system.user.job'),
    prop: 'job',
    align: 'center',
    width: 180,
    formatter: (row: UserResult) => {
      return row.job.name
    },
  },
  {
    label: t('views.system.user.gender'),
    align: 'center',
    prop: 'gender',
    width: 120,
    formatter: (row: UserResult) => {
      if (row.gender === 1) {
        return t('common.basic.female')
      } else if (row.gender === 2) {
        return t('common.basic.male')
      } else {
        return t('common.basic.secrecy')
      }
    },
  },
  {
    label: t('views.system.user.mobile'),
    prop: 'mobile',
    align: 'center',
    width: 180,
  },
  {
    label: t('views.system.user.nickname'),
    prop: 'nickname',
    align: 'center',
    width: 160,
  },
  {
    label: t('views.system.user.email'),
    prop: 'email',
    align: 'center',
    width: 180,
  },
  {
    label: t('common.basic.operation'),
    align: 'center',
    width: 140,
    fixed: 'right',
    slot: 'action',
  },
])

// Department
const [getDeptListRequest, _] = useGetDeptListRequest()

async function processDeptListResult() {
  const { list } = await getDeptListRequest()
  return listToTree(list)
}

const deptColumns = ref<BasicColumn[]>([
  {
    label: t('views.system.dept.name'),
    prop: 'name',
  },
])
</script>
