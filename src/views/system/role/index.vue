<template>
  <PageWrapper>
    <BasicTable
      :api="getRoleListRequest"
      row-key="id"
      @register="registerTable"
      :pagination="false"
      :columns="createColumns()"
    >
      <template #toolbar>
        <ElButton
          type="primary"
          @click="openEditRoleFormDialog()"
          :disabled="!hasPermission(Api.add)"
        >
          新增
        </ElButton>
      </template>

      <template #action="{ row }">
        <BasicTableAction
          :actions="[
            {
              label: '编辑',
              onClick: openEditRoleFormDialog.bind(null, row),
              disabled: !hasPermission(Api.update),
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
  </PageWrapper>
</template>

<script setup lang="ts">
import type { RoleResult } from '/@/api/system/role'

import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable, BasicTableAction } from '/@/components/Table'
import {
  getRoleListRequest,
  deleteRoleRequest,
  Api,
  addRoleRequest,
  updateRoleRequest,
} from '/@/api/system/role'
import { usePermission } from '/@/composables/core/usePermission'
import { createColumns } from './columns'
import { createSchemas } from './schemas'
import { createFormDialog } from '/@/components/Form'
import { ref } from 'vue'
import { getMenuListRequest } from '/@/api/system/menu'

const { hasPermission } = usePermission()

const [registerTable, { getDataSource, reload }] = useTable()

const fdInstance = createFormDialog({
  dialogProps: { title: '编辑角色信息' },
  formProps: { schemas: createSchemas(), labelWidth: '100px' },
  submit: async (res: Omit<RoleResult, 'id'>, { showLoading, hideLoading, close }) => {
    try {
      showLoading()

      if (updateRoleId.value === null) {
        await addRoleRequest(res)
      } else {
        await updateRoleRequest({
          ...res,
          id: updateRoleId.value!,
        })
      }

      close()

      reload()
    } finally {
      hideLoading()
    }
  },
})

const updateRoleId = ref<number | null>(null)

function openEditRoleFormDialog(update?: Recordable) {
  fdInstance.open(async ({ getFormAction, showLoading, hideLoading, close }) => {
    try {
      showLoading()
      const permTree = await getMenuListRequest()

      getFormAction()?.updateSchema({
        prop: 'permMenuIds',
        componentProps: {
          data: permTree,
        },
      })
    } catch (e) {
      close()
    } finally {
      hideLoading()
    }

    const roleTree = [
      {
        id: 0,
        name: '#',
        children: getDataSource(),
      },
    ]

    getFormAction()?.updateSchema({
      prop: 'parentId',
      componentProps: {
        data: roleTree,
      },
    })

    // is update?
    if (update) {
      getFormAction()?.setFormModel(update)
      updateRoleId.value = update.id
    } else {
      updateRoleId.value = null
    }
  })
}

async function handleDelete(row: Recordable) {
  await deleteRoleRequest({ id: row.id })
  reload()
}
</script>
