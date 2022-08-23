<template>
  <PageWrapper>
    <BasicTable
      :columns="columns"
      :api="processDeptListResult"
      row-key="id"
      @register="registerTable"
      :pagination="false"
    >
      <template #toolbar>
        <ElButton type="primary" @click="openEditDeptFormDialog()">新增</ElButton>
      </template>

      <template #type="{ row }">
        <ElTag :type="getTypeTag(row.type)">{{ formatterType(row.type) }}</ElTag>
      </template>

      <template #action="{ row }">
        <ElButton type="primary" link @click="openEditDeptFormDialog(row)">编辑</ElButton>
        <ElButton type="danger" link @click="handleDelete(row)">删除</ElButton>
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
import EditDeptFormDialog from './components/EditDeptFormDialog.vue'
import { useDialog } from '/@/components/Dialog'

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
      return '公司'
    case 2:
      return '子公司'
    case 3:
      return '部门'
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
    label: '部门名称',
    prop: 'name',
  },
  {
    align: 'center',
    width: 140,
    label: '部门标识',
    prop: 'uniqueKey',
  },
  {
    align: 'center',
    width: 300,
    label: '部门全称',
    prop: 'fullName',
  },
  {
    align: 'center',
    width: 120,
    label: '部门类型',
    prop: 'type',
    slot: 'type',
  },
  {
    align: 'center',
    width: 100,
    label: '状态',
    prop: 'status',
    formatter: (row: Recordable) => {
      return row.status === 0 ? '禁用' : '启用'
    },
  },
  {
    align: 'center',
    width: 80,
    label: '排序',
    prop: 'orderNum',
  },
  {
    align: 'center',
    label: '备注',
    prop: 'remark',
  },
  {
    width: 140,
    align: 'center',
    label: '操作',
    fixed: 'right',
    slot: 'action',
  },
])
</script>
