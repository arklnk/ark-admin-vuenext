<template>
  <PageWrapper>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <ElButton
          type="primary"
          @click="openEditDeptFormDialog()"
          :disabled="!hasPermission(Api.add)"
        >
          新增
        </ElButton>
      </template>

      <template #type="{ row }">
        <ElTag :type="getTypeTag(row.type)">{{ formatterType(row.type) }}</ElTag>
      </template>

      <template #action="{ row }">
        <BasicTableAction
          :actions="[
            {
              label: '编辑',
              onClick: openEditDeptFormDialog.bind(null, row),
              disabled: !hasPermission(Api.update),
            },
            {
              label: '删除',
              popconfirm: true,
              type: 'danger',
              disabled: !hasPermission(Api.delete),
              onClick: handleDelete.bind(null, row),
            },
          ]"
        />
      </template>
    </BasicTable>

    <EditDeptFormDialog @register="registerDialog" @success="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { DeptResult } from '/@/api/system/dept'

import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable, BasicTableAction } from '/@/components/Table'
import { getDeptListRequest, deleteDeptRequest, Api } from '/@/api/system/dept'
import EditDeptFormDialog from './components/EditDeptFormDialog.vue'
import { useDialog } from '/@/components/Dialog'
import { usePermission } from '/@/composables/core/usePermission'

const { hasPermission } = usePermission()

const [registerDialog, { openDialog }] = useDialog()
const [registerTable, { getDataSource, reload }] = useTable({
  api: getDeptListRequest,
  rowKey: 'id',
  pagination: false,
  columns: [
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
  ],
})

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
</script>
