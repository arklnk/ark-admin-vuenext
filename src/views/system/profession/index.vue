<template>
  <PageWrapper>
    <BasicTable
      :api="getProfPageRequest"
      @register="registerTable"
      row-key="id"
      :columns="createColumns()"
    >
      <template #toolbar>
        <ElButton
          type="primary"
          @click="openEditProfFormDialog()"
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
              onClick: openEditProfFormDialog.bind(null, row),
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
import type { ProfessionResult } from '/@/api/system/profession'

import {
  getProfPageRequest,
  deleteProfRequest,
  addProfRequest,
  updateProfRequest,
  Api,
} from '/@/api/system/profession'
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable, BasicTableAction } from '/@/components/Table'
import { usePermission } from '/@/composables/core/usePermission'
import { createColumns } from './columns'
import { createSchemas } from './schemas'
import { createFormDialog } from '/@/components/Form'
import { ref } from 'vue'

const { hasPermission } = usePermission()

const [registerTable, { reload }] = useTable()

const updateProfId = ref<number | null>(null)

const fdInstance = createFormDialog({
  dialogProps: { title: '编辑职称信息' },
  formProps: { labelWidth: '100px', schemas: createSchemas() },
  submit: async (res: Omit<ProfessionResult, 'id'>, { showLoading, hideLoading, close }) => {
    try {
      showLoading()

      if (updateProfId.value === null) {
        await addProfRequest(res)
      } else {
        await updateProfRequest({
          ...res,
          id: updateProfId.value,
        })
      }

      close()

      reload()
    } finally {
      hideLoading()
    }
  },
})

function openEditProfFormDialog(update?: Recordable) {
  fdInstance.open(({ getFormAction }) => {
    // is update?
    if (update) {
      getFormAction()?.setFormModel(update)
      updateProfId.value = update.id
    } else {
      updateProfId.value = null
    }
  })
}

async function handleDelete(row: ProfessionResult) {
  await deleteProfRequest({ id: row.id })
  reload()
}
</script>
