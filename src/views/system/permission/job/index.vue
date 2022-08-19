<template>
  <PageWrapper>
    <BasicTable :columns="columns" :api="processRequestData" @register="registerTable">
      <template #toolbar>
        <ElButton type="primary" @click="openEditRoleFormDialog()">{{
          t('common.basic.add')
        }}</ElButton>
      </template>

      <template #action="{ row }">
        <ElButton type="primary" link @click="openEditRoleFormDialog(row)">{{
          t('common.basic.edit')
        }}</ElButton>
        <ElButton type="danger" link @click="handleDelete(row)">{{
          t('common.basic.delete')
        }}</ElButton>
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
import { useGetJobListRequest, useDeleteJobRequest } from '/@/api/system/job.api'
import { useTransl } from '/@/composables/core/useTransl'
import EditJobFormDialog from './components/EditJobFormDialog.vue'
import { useDialog } from '/@/components/Dialog'

const { t } = useTransl()

const [getJobListRequest, _] = useGetJobListRequest()
const [deleteJobRequest, __] = useDeleteJobRequest()

const [registerDialog, { openDialog }] = useDialog()
const [registerTable, { reload }] = useTable()

function openEditRoleFormDialog(update?: JobResult) {
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
    label: t('views.system.job.name'),
    prop: 'name',
    minWidth: 300,
    align: 'center',
  },
  {
    align: 'center',
    label: t('common.basic.status'),
    prop: 'status',
    formatter: (row: Recordable) => {
      return row.status === 0 ? t('common.basic.disabled') : t('common.basic.enable')
    },
  },
  {
    align: 'center',
    label: t('common.basic.sort'),
    prop: 'orderNum',
  },
  {
    align: 'center',
    label: t('common.basic.operation'),
    slot: 'action',
    width: 140,
    fixed: 'right',
  },
])
</script>
