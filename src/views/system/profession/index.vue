<template>
  <PageWrapper>
    <BasicTable :api="getProfPageRequest" @register="registerTable">
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

    <FormDialogRender
      :dialog-props="{ title: '编辑职称信息' }"
      :form-props="{ labelWidth: '100px', schemas }"
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
import { columns } from './columns'
import { schemas } from './schemas'
import { createFormDialog } from '/@/components/Form'
import { ref } from 'vue'

const { hasPermission } = usePermission()

const FormDialogRender = createFormDialog()

const [registerTable, { reload }] = useTable({
  columns,
  rowKey: 'id',
})

const updateProfId = ref<number | null>(null)

function openEditProfFormDialog(update?: Recordable) {
  FormDialogRender.open((_, formAction) => {
    // is update?
    if (update) {
      formAction.setFormModel(update)
      updateProfId.value = update.id
    } else {
      updateProfId.value = null
    }
  })
}

async function handleSubmit(res: Omit<ProfessionResult, 'id'>) {
  try {
    FormDialogRender.setDialogProps({ confirmBtnProps: { loading: true } })
    FormDialogRender.setFormProps({ disabled: true })

    if (updateProfId.value === null) {
      await addProfRequest(res)
    } else {
      await updateProfRequest({
        ...res,
        id: updateProfId.value,
      })
    }

    FormDialogRender.close()

    reload()
  } finally {
    FormDialogRender.setDialogProps({ confirmBtnProps: { loading: false } })
    FormDialogRender.setFormProps({ disabled: false })
  }
}

async function handleDelete(row: ProfessionResult) {
  await deleteProfRequest({ id: row.id })
  reload()
}
</script>
