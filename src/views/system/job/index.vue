<template>
  <PageWrapper>
    <BasicTable
      :api="getJobPageRequest"
      @register="registerTable"
      row-key="id"
      :columns="createColumns()"
    >
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
        <BasicTableAction
          :actions="[
            {
              label: '编辑',
              onClick: openEditJobFormDialog.bind(null, row),
              disabled: !hasPermission(Api.update),
            },
            {
              label: '删除',
              popconfirm: true,
              type: 'danger',
              onClick: handleDelete.bind(null, row),
              disabled: !hasPermission(Api.delete),
            },
          ]"
        />
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script setup lang="ts">
import type { JobResult } from '/@/api/system/job'

import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable, BasicTableAction } from '/@/components/Table'
import {
  getJobPageRequest,
  deleteJobRequest,
  addJobRequest,
  updateJobRequest,
  Api,
} from '/@/api/system/job'
import { usePermission } from '/@/composables/core/usePermission'
import { createColumns } from './columns'
import { createSchemas } from './schemas'
import { createFormDialog } from '/@/components/Form'
import { ref } from 'vue'

const { hasPermission } = usePermission()

const [registerTable, { reload }] = useTable()

const fdInstance = createFormDialog({
  formProps: { schemas: createSchemas(), labelWidth: '100px' },
  dialogProps: { title: '编辑岗位信息' },
  submit: async (res: Omit<JobResult, 'id'>, { showLoading, hideLoading, close }) => {
    try {
      showLoading()

      if (updateJobId.value === null) {
        await addJobRequest(res)
      } else {
        await updateJobRequest({
          ...res,
          id: updateJobId.value,
        })
      }

      close()

      reload()
    } finally {
      hideLoading()
    }
  },
})

const updateJobId = ref<number | null>(null)

function openEditJobFormDialog(update?: JobResult) {
  fdInstance.open(({ getFormAction }) => {
    if (update) {
      updateJobId.value = update.id
      getFormAction()?.setFormModel(update)
    } else {
      updateJobId.value = null
    }
  })
}

async function handleDelete(row: JobResult) {
  await deleteJobRequest({ id: row.id })
  reload()
}
</script>
