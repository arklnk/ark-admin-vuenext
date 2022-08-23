<template>
  <PageWrapper>
    <BasicTable :columns="columns" :api="processRequestData" @register="registerTable">
      <template #toolbar>
        <ElButton type="primary" @click="openEditJobFormDialog()">新增</ElButton>
      </template>

      <template #action="{ row }">
        <ElButton type="primary" link @click="openEditJobFormDialog(row)">编辑</ElButton>
        <ElButton type="danger" link @click="handleDelete(row)">删除</ElButton>
      </template>
    </BasicTable>

    <EditJobFormDialog @register="registerDialog" @success="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { BasicColumn } from '/@/components/Table'
import type { JobResult } from '/@/api/system/job.api'

import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { ref } from 'vue'
import { useGetJobPageRequest, useDeleteJobRequest } from '/@/api/system/job.api'
import EditJobFormDialog from './components/EditJobFormDialog.vue'
import { useDialog } from '/@/components/Dialog'

const [getJobListRequest, _] = useGetJobPageRequest()
const [deleteJobRequest, __] = useDeleteJobRequest()

const [registerDialog, { openDialog }] = useDialog()
const [registerTable, { reload }] = useTable()

function openEditJobFormDialog(update?: JobResult) {
  openDialog({
    item: update,
  })
}

async function handleDelete(row: JobResult) {
  await deleteJobRequest({ id: row.id })
  reload()
}

async function processRequestData(params: any) {
  return await getJobListRequest(params)
}

const columns = ref<BasicColumn[]>([
  {
    label: '岗位名称',
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
