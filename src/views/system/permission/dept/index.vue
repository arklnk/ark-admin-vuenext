<template>
  <PageWrapper>
    <BasicTable
      :columns="columns"
      :api="processDeptListResult"
      row-key="id"
      @register="registerTable"
    >
      <template #toolbar>
        <ElButton type="primary" @click="openEditDeptFormDialog()">{{
          t('common.basic.add')
        }}</ElButton>
      </template>

      <template #type="{ row }">
        <ElTag :type="getTypeTag(row.type)">{{ formatterType(row.type) }}</ElTag>
      </template>

      <template #action="{ row }">
        <ElButton type="primary" link @click="openEditDeptFormDialog(row)">{{
          t('common.basic.edit')
        }}</ElButton>
        <ElButton type="danger" link @click="handleDelete(row)">{{
          t('common.basic.delete')
        }}</ElButton>
      </template>
    </BasicTable>

    <EditDeptFormDialog @register="registerDialog" @success="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
import { BasicColumn, useTable } from '/@/components/Table'
import type { DeptResult } from '/@/api/system/dept.api'

import { PageWrapper } from '/@/components/Page'
import { BasicTable } from '/@/components/Table'
import { ref } from 'vue'
import { useGetDeptListRequest, useDeleteDeptRequest } from '/@/api/system/dept.api'
import { listToTree } from '/@/utils/helper/tree'
import { useTransl } from '/@/composables/core/useTransl'
import EditDeptFormDialog from './components/EditDeptFormDialog.vue'
import { useDialog } from '/@/components/Dialog'

const { t } = useTransl()
const [getDeptListRequest, _] = useGetDeptListRequest()
const [deleteDeptRequest, __] = useDeleteDeptRequest()

async function processDeptListResult() {
  const { list } = await getDeptListRequest()
  return listToTree(list)
}

const [registerDialog, { openDialog }] = useDialog()
const [registerTable, { getDataSource, reload }] = useTable()

function openEditDeptFormDialog(update?: DeptResult) {
  openDialog({
    list: getDataSource(),
    item: update,
  })
}

async function handleDelete(row: DeptResult) {
  await deleteDeptRequest({ id: row.id })
  reload()
}

function formatterType(type: number) {
  switch (type) {
    case 1:
      return t('views.system.dept.deptTypeCompany')
    case 2:
      return t('views.system.dept.deptTypeSubsidiary')
    case 3:
      return t('views.system.dept.deptTypeDepartment')
  }
}

function getTypeTag(type: number) {
  switch (type) {
    case 2:
      return 'warning'
    case 3:
      return 'success'
    default:
      return ''
  }
}

const columns = ref<BasicColumn[]>([
  {
    width: 300,
    label: t('views.system.dept.name'),
    prop: 'name',
  },
  {
    align: 'center',
    width: 140,
    label: t('views.system.dept.code'),
    prop: 'uniqueKey',
  },
  {
    align: 'center',
    width: 300,
    label: t('views.system.dept.fullname'),
    prop: 'fullName',
  },
  {
    align: 'center',
    width: 120,
    label: t('views.system.dept.type'),
    prop: 'type',
    slot: 'type',
  },
  {
    align: 'center',
    width: 100,
    label: t('common.basic.status'),
    prop: 'status',
    formatter: (row: Recordable) => {
      return row.status === 0 ? t('common.basic.disabled') : t('common.basic.enable')
    },
  },
  {
    align: 'center',
    width: 80,
    label: t('common.basic.sort'),
    prop: 'orderNum',
  },
  {
    align: 'center',
    label: t('common.basic.remark'),
    prop: 'remark',
  },
  {
    width: 140,
    align: 'center',
    label: t('common.basic.operation'),
    fixed: 'right',
    slot: 'action',
  },
])
</script>
