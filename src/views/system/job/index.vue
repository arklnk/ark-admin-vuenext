<template>
  <PageWrapper>
    <BasicTable :columns="columns" :api="getJobPageRequest" @register="registerTable">
      <template #toolbar>
        <ElButton
          type="primary"
          @click="openEditJobFormDialog()"
          :disabled="!hasPermission(Api.add)"
        >
          新增
        </ElButton>
      </template>

      <template #action="{ row }">
        <ElButton
          type="primary"
          link
          @click="openEditJobFormDialog(row)"
          :disabled="!hasPermission(Api.update)"
        >
          编辑
        </ElButton>
        <PopConfirmButton
          type="danger"
          link
          @click="handleDelete(row)"
          :disabled="!hasPermission(Api.delete)"
        >
          删除
        </PopConfirmButton>
      </template>
    </BasicTable>

    <EditJobFormDialog @register="registerDialog" @success="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { BasicColumn } from '/@/components/Table'
import type { JobResult } from '/@/api/system/job'

import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { ref } from 'vue'
import { getJobPageRequest, deleteJobRequest, Api } from '/@/api/system/job'
import EditJobFormDialog from './components/EditJobFormDialog.vue'
import { useDialog } from '/@/components/Dialog'
import { PopConfirmButton } from '/@/components/Button'
import { usePermission } from '/@/composables/core/usePermission'

const { hasPermission } = usePermission()

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
