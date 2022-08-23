<template>
  <PageWrapper>
    <BasicTable :api="getProfListRequest" :columns="columns" @register="registerTable">
      <template #toolbar>
        <ElButton type="primary" @click="openEditProfFormDialog()">新增</ElButton>
      </template>

      <template #action="{ row }">
        <ElButton type="primary" link @click="openEditProfFormDialog(row)">编辑</ElButton>
        <ElButton type="danger" link @click="handleDelete(row)">删除</ElButton>
      </template>
    </BasicTable>

    <EditProfFormDialog @register="registerDialog" @success="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { BasicColumn } from '/@/components/Table'
import type { ProfessionResult } from '/@/api/system/profession.api'

import { useGetProfPageRequest, useDeleteProfRequest } from '/@/api/system/profession.api'
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { ref } from 'vue'
import EditProfFormDialog from './components/EditProfFormDialog.vue'
import { useDialog } from '/@/components/Dialog'

const [getProfListRequest, _] = useGetProfPageRequest()
const [deleteProfRequest, __] = useDeleteProfRequest()

const [registerDialog, { openDialog }] = useDialog()
const [registerTable, { reload }] = useTable()

function openEditProfFormDialog(update?: Recordable) {
  openDialog({
    item: update,
  })
}

async function handleDelete(row: ProfessionResult) {
  await deleteProfRequest({ id: row.id })
  reload()
}

const columns = ref<BasicColumn[]>([
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
])
</script>
