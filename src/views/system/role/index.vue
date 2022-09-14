<template>
  <PageWrapper>
    <BasicTable
      :api="getRoleListRequest"
      row-key="id"
      @register="registerTable"
      :pagination="false"
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

    <FormDialogRender
      :dialog-props="{ title: '编辑角色信息' }"
      :form-props="{ schemas, labelWidth: '100px' }"
      :handle-submit="handleSubmit"
    >
      <template #status="{ model }">
        <ElRadioGroup v-model="model.status">
          <ElRadio :label="1">启用</ElRadio>
          <ElRadio :label="0">禁用</ElRadio>
        </ElRadioGroup>
      </template>
    </FormDialogRender>
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
import { columns } from './columns'
import { schemas } from './schemas'
import { createFormDialog } from '/@/components/Form'
import { ref } from 'vue'
import { getMenuListRequest } from '/@/api/system/menu'

const { hasPermission } = usePermission()

const [registerTable, { getDataSource, reload }] = useTable({
  columns,
  rowKey: 'id',
})

const FormDialogRender = createFormDialog()

const updateRoleId = ref<number | null>(null)

function openEditRoleFormDialog(update?: Recordable) {
  FormDialogRender.open(async (_, formAction) => {
    try {
      FormDialogRender.setDialogProps({ loading: true })
      const permTree = await getMenuListRequest()

      formAction.updateSchema({
        prop: 'permMenuIds',
        componentProps: {
          data: permTree,
        },
      })
    } catch (e) {
      FormDialogRender.close()
    } finally {
      FormDialogRender.setDialogProps({ loading: false })
    }

    const roleTree = [
      {
        id: 0,
        name: '#',
        children: getDataSource() || [],
      },
    ]

    formAction.updateSchema({
      prop: 'parentId',
      componentProps: {
        data: roleTree,
      },
    })

    // is update?
    if (update) {
      formAction.setFormModel(update)
      updateRoleId.value = update.id
    } else {
      updateRoleId.value = null
    }
  })
}

async function handleSubmit(res: Omit<RoleResult, 'id'>) {
  try {
    FormDialogRender.setFormProps({ disabled: true })
    FormDialogRender.setDialogProps({ confirmBtnProps: { loading: true } })

    if (updateRoleId.value === null) {
      await addRoleRequest(res)
    } else {
      await updateRoleRequest({
        ...res,
        id: updateRoleId.value!,
      })
    }

    FormDialogRender.close()

    reload()
  } finally {
    FormDialogRender.setFormProps({ disabled: false })
    FormDialogRender.setDialogProps({ confirmBtnProps: { loading: false } })
  }
}

async function handleDelete(row: Recordable) {
  await deleteRoleRequest({ id: row.id })
  reload()
}
</script>
