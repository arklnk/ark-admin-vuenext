<template>
  <PageWrapper>
    <BasicTable :columns="columns" :api="processRequestData" row-key="id" @register="registerTable">
      <template #toolbar>
        <ElButton type="primary" @click="openEditRoleFormDialog()">{{
          t('common.basic.add')
        }}</ElButton>
      </template>

      <template #action="{ row }">
        <ElButton type="primary" link @click.stop="handleUpdate(row)">{{
          t('common.basic.edit')
        }}</ElButton>
        <ElButton type="danger" link @click.stop="handleDelete(row)">{{
          t('common.basic.delete')
        }}</ElButton>
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
import { useTransl } from '/@/composables/core/useTransl'
import { useGetRoleListRequest, useDeleteRoleRequest } from '/@/api/system/role.api'
import { listToTree } from '/@/utils/helper/tree'
import EditRoleFormDialog from './components/EditRoleFormDialog.vue'
import { useDialog } from '/@/components/Dialog'

const { t } = useTransl()

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
    label: t('views.system.role.name'),
    prop: 'name',
    width: 320,
  },
  {
    label: t('views.system.role.uniqueKey'),
    prop: 'uniqueKey',
    width: 320,
  },
  {
    align: 'center',
    width: 100,
    label: t('common.basic.status'),
    prop: 'status',
    formatter: (row: Recordable): string => {
      return row.status === 0 ? t('common.basic.disabled') : t('common.basic.enable')
    },
  },
  {
    align: 'center',
    label: t('common.basic.remark'),
    prop: 'remark',
    showTooltipWhenOverflow: true,
  },
  {
    width: 100,
    align: 'center',
    label: t('common.basic.sort'),
    prop: 'orderNum',
  },
  {
    width: 140,
    align: 'center',
    label: t('common.basic.operation'),
    slot: 'action',
    fixed: 'right',
  },
])
</script>
