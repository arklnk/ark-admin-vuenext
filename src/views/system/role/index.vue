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

    <EditRoleFormDialog @register="registerDialog" @success="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable, BasicTableAction } from '/@/components/Table'
import { getRoleListRequest, deleteRoleRequest, Api } from '/@/api/system/role'
import EditRoleFormDialog from './components/EditRoleFormDialog.vue'
import { useDialog } from '/@/components/Dialog'
import { usePermission } from '/@/composables/core/usePermission'

const { hasPermission } = usePermission()

const [registerDialog, { openDialog }] = useDialog()
const [registerTable, { getDataSource, reload }] = useTable({
  columns: [
    {
      label: '角色名称',
      prop: 'name',
      width: 280,
    },
    {
      label: '角色标识',
      prop: 'uniqueKey',
      width: 220,
      align: 'center',
    },
    {
      align: 'center',
      width: 100,
      label: '状态',
      prop: 'status',
      formatter: (row: Recordable): string => {
        return row.status === 0 ? '禁用' : '启用'
      },
    },
    {
      align: 'center',
      label: '备注',
      prop: 'remark',
      showTooltipWhenOverflow: true,
    },
    {
      width: 100,
      align: 'center',
      label: '排序',
      prop: 'orderNum',
    },
    {
      width: 140,
      align: 'center',
      label: '操作',
      slot: 'action',
      fixed: 'right',
    },
  ],
})

function openEditRoleFormDialog(update?: Recordable) {
  openDialog({
    list: getDataSource(),
    item: update,
  })
}

async function handleDelete(row: Recordable) {
  await deleteRoleRequest({ id: row.id })
  reload()
}
</script>
