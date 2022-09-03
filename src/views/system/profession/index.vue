<template>
  <PageWrapper>
    <BasicTable :api="getProfPageRequest" @register="registerTable">
      <template #toolbar>
        <ElButton
          type="primary"
          @click="openEditProfFormDialog()"
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
              onClick: openEditProfFormDialog.bind(null, row),
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

    <EditProfFormDialog @register="registerDialog" @success="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { ProfessionResult } from '/@/api/system/profession'

import { getProfPageRequest, deleteProfRequest, Api } from '/@/api/system/profession'
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable, BasicTableAction } from '/@/components/Table'
import EditProfFormDialog from './components/EditProfFormDialog.vue'
import { useDialog } from '/@/components/Dialog'
import { usePermission } from '/@/composables/core/usePermission'

const { hasPermission } = usePermission()

const [registerDialog, { openDialog }] = useDialog()
const [registerTable, { reload }] = useTable({
  columns: [
    {
      label: '职称',
      prop: 'name',
      minWidth: 300,
      align: 'center',
    },
    {
      align: 'center',
      label: '状态',
      prop: 'status',
      formatter: (row: Recordable) => {
        return row.status === 0 ? '禁用' : '启用'
      },
    },
    {
      align: 'center',
      label: '排序',
      prop: 'orderNum',
    },
    {
      align: 'center',
      label: '操作',
      slot: 'action',
      width: 140,
      fixed: 'right',
    },
  ],
})

function openEditProfFormDialog(update?: Recordable) {
  openDialog({
    item: update,
  })
}

async function handleDelete(row: ProfessionResult) {
  await deleteProfRequest({ id: row.id })
  reload()
}
</script>
