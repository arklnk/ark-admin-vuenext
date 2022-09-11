<template>
  <PageWrapper>
    <BasicTable :api="getJobPageRequest" @register="registerTable">
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

    <FormDialogRender
      :form-props="{ schemas, labelWidth: '100px' }"
      :dialog-props="{ title: '编辑岗位信息' }"
      :handle-submit="handleSubmit"
    >
      <template #status="{ model }">
        <ElRadioGroup v-model="model.status">
          <ElRadio :label="1">启用</ElRadio>
          <ElRadio :label="0">禁用</ElRadio>
        </ElRadioGroup>
      </template>
    </FormDialogRender>
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
import { columns } from './columns'
import { createFormDialog } from '/@/components/Form'
import { schemas } from './schemas'
import { ref } from 'vue'

const { hasPermission } = usePermission()

const [registerTable, { reload }] = useTable({ columns })

const FormDialogRender = createFormDialog()

const updateJobId = ref<number | null>(null)

function openEditJobFormDialog(update?: JobResult) {
  FormDialogRender.open((_, formAction) => {
    if (update) {
      updateJobId.value = update.id
      formAction.setFormModel(update)
    } else {
      updateJobId.value = null
    }
  })
}

async function handleSubmit(res: Omit<JobResult, 'id'>) {
  try {
    FormDialogRender.setDialogProps({ confirmBtnProps: { loading: true } })
    FormDialogRender.setFormProps({ disabled: true })

    if (updateJobId.value === null) {
      await addJobRequest(res)
    } else {
      await updateJobRequest({
        ...res,
        id: updateJobId.value,
      })
    }

    FormDialogRender.close()
    reload()
  } finally {
    FormDialogRender.setDialogProps({ confirmBtnProps: { loading: false } })
    FormDialogRender.setFormProps({ disabled: false })
  }
}

async function handleDelete(row: JobResult) {
  await deleteJobRequest({ id: row.id })
  reload()
}
</script>
