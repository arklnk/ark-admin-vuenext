<template>
  <PageWrapper>
    <BasicTable :columns="columns" :api="processRequestData">
      <template #toolbar>
        <ElButton type="primary" @click="openEditRoleFormDialog()">{{
          t('common.basic.add')
        }}</ElButton>
      </template>

      <template #action>
        <ElButton type="primary" link>{{ t('common.basic.edit') }}</ElButton>
        <ElButton type="danger" link>{{ t('common.basic.delete') }}</ElButton>
      </template>
    </BasicTable>

    <EditJobFormDialog @register="registerDialog" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { BasicColumn } from '/@/components/Table'

import { PageWrapper } from '/@/components/Page'
import { BasicTable } from '/@/components/Table'
import { ref } from 'vue'
import { useGetJobListRequest } from '/@/api/system/job.api'
import { useTransl } from '/@/composables/core/useTransl'
import EditJobFormDialog from './components/EditJobFormDialog.vue'
import { useDialog } from '/@/components/Dialog'

const { t } = useTransl()

const [getJobListRequest, _] = useGetJobListRequest()

const [registerDialog, { openDialog }] = useDialog()

function openEditRoleFormDialog() {
  openDialog()
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
