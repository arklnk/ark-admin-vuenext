<template>
  <PageWrapper>
    <BasicTable
      :columns="columns"
      :api="processRequestData"
      row-key="id"
      @register="registerTable"
      :pagination="false"
    >
      <template #toolbar>
        <ElButton type="primary" @click="openEditRoleFormDialog()">新增</ElButton>
      </template>

      <template #action="{ row }">
        <ElButton type="primary" link @click="handleUpdate(row)">编辑</ElButton>
        <ElButton type="danger" link @click="handleDelete(row)">删除</ElButton>
      </template>
    </BasicTable>

    <EditRoleFormDialog @register="registerDialog" @success="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { BasicColumn } from '/@/components/Table'

import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { ref } from 'vue'
import { useGetRoleListRequest, useDeleteRoleRequest } from '/@/api/system/role.api'
import { listToTree } from '/@/utils/helper/tree'
import EditRoleFormDialog from './components/EditRoleFormDialog.vue'
import { useDialog } from '/@/components/Dialog'

const [getRoleListRequest, _] = useGetRoleListRequest()
const [deleteRoleRequest, __] = useDeleteRoleRequest()

async function processRequestData() {
  const { list } = await getRoleListRequest()
  return listToTree(list)
}

const [registerDialog, { openDialog }] = useDialog()
const [registerTable, { getDataSource, reload }] = useTable()

function openEditRoleFormDialog(update?: Recordable) {
  openDialog({
    list: getDataSource(),
    item: update,
  })
}

function handleUpdate(row: Recordable) {
  openEditRoleFormDialog(row)
}

async function handleDelete(row: Recordable) {
  await deleteRoleRequest({ id: row.id })
  reload()
}

const columns = ref<BasicColumn[]>([
  {
    label: '角色名称',
    prop: 'name',
    width: 320,
  },
  {
    label: '角色标识',
    prop: 'uniqueKey',
    width: 320,
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
])
</script>
