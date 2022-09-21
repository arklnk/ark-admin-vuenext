<template>
  <PageWrapper>
    <BasicTable
      @register="registerTable"
      :api="getDeptListRequest"
      row-key="id"
      :pagination="false"
      :columns="createColumns()"
    >
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
  </PageWrapper>
</template>

<script setup lang="ts">
import type { DeptResult } from '/@/api/system/dept'

import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable, BasicTableAction } from '/@/components/Table'
import {
  getDeptListRequest,
  deleteDeptRequest,
  addDeptRequest,
  updateDeptRequest,
  Api,
} from '/@/api/system/dept'
import { usePermission } from '/@/composables/core/usePermission'
import { createFormDialog } from '/@/components/Form'
import { createColumns } from './columns'
import { createSchemas } from './schemas'
import { ref } from 'vue'

const { hasPermission } = usePermission()

const [registerTable, { getDataSource, reload }] = useTable()

const updateDeptId = ref<number | null>(null)

const fdInstance = createFormDialog({
  formProps: { labelWidth: '100px', schemas: createSchemas() },
  dialogProps: { title: '编辑部门信息' },
  submit: async (res: Omit<DeptResult, 'id'>, { showLoading, hideLoading, close }) => {
    try {
      showLoading()

      if (updateDeptId.value === null) {
        await addDeptRequest(res)
      } else {
        await updateDeptRequest({
          ...res,
          id: updateDeptId.value,
        })
      }

      close()

      reload()
    } finally {
      hideLoading()
    }
  },
})

function openEditDeptFormDialog(update?: DeptResult) {
  fdInstance.open(({ getFormAction }) => {
    const deptTree = [
      {
        id: 0,
        name: '#',
        children: getDataSource(),
      },
    ]

    getFormAction()?.updateSchema({
      prop: 'parentId',
      componentProps: {
        data: deptTree,
      },
    })

    // is update?
    if (update) {
      updateDeptId.value = update.id
      getFormAction()?.setFormModel(update)
    } else {
      updateDeptId.value = null
    }
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
