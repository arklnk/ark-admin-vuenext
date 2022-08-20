<template>
  <PageWrapper>
    <BasicTable :api="getProfListRequest" :columns="columns" @register="registerTable">
      <template #toolbar>
        <ElButton type="primary" @click="openEditProfFormDialog()">{{
          t('common.basic.add')
        }}</ElButton>
      </template>

      <template #action="{ row }">
        <ElButton type="primary" link @click="openEditProfFormDialog(row)">{{
          t('common.basic.edit')
        }}</ElButton>
        <ElButton type="danger" link @click="handleDelete(row)">{{
          t('common.basic.delete')
        }}</ElButton>
      </template>
    </BasicTable>

    <EditProfFormDialog @register="registerDialog" @success="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { BasicColumn } from '/@/components/Table'
import type { ProfessionResult } from '/@/api/system/profession.api'

import { useGetProfListRequest, useDeleteProfRequest } from '/@/api/system/profession.api'
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { ref } from 'vue'
import { useTransl } from '/@/composables/core/useTransl'
import EditProfFormDialog from './components/EditProfFormDialog.vue'
import { useDialog } from '/@/components/Dialog'

const { t } = useTransl()

const [getProfListRequest, _] = useGetProfListRequest()
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
    label: t('views.system.profession.name'),
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
