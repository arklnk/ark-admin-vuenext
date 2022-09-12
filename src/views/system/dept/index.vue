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

    <FormDialogRender
      :form-props="{ labelWidth: '100px', schemas }"
      :dialog-props="{ title: '编辑部门信息' }"
      :handle-submit="handleSubmit"
    >
      <template #status="{ model }">
        <ElRadioGroup v-model="model.status">
          <ElRadio :label="1">启用</ElRadio>
          <ElRadio :label="0">禁用</ElRadio>
        </ElRadioGroup>
      </template>
      <template #type="{ model }">
        <ElSelect v-model="model.type" class="w-full">
          <ElOption label="公司" :value="1" />
          <ElOption label="子公司" :value="2" />
          <ElOption label="部门" :value="3" />
        </ElSelect>
      </template>
    </FormDialogRender>
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
import { columns } from './columns'
import { createFormDialog } from '/@/components/Form'
import { schemas } from './schemas'
import { ref } from 'vue'

const { hasPermission } = usePermission()

const [registerTable, { getDataSource, reload }] = useTable({
  api: getDeptListRequest,
  rowKey: 'id',
  pagination: false,
  columns,
})

const FormDialogRender = createFormDialog()

const updateDeptId = ref<number | null>(null)

function openEditDeptFormDialog(update?: DeptResult) {
  FormDialogRender.open((_, formAction) => {
    const deptTree = [
      {
        id: 0,
        name: '#',
        children: getDataSource(),
      },
    ]

    formAction.updateSchema({
      prop: 'parentId',
      componentProps: {
        data: deptTree,
      },
    })

    // is update?
    if (update) {
      updateDeptId.value = update.id
      formAction.setFormModel(update)
    } else {
      updateDeptId.value = null
    }
  })
}

async function handleDelete(row: DeptResult) {
  await deleteDeptRequest({ id: row.id })
  reload()
}

async function handleSubmit(res: Omit<DeptResult, 'id'>) {
  try {
    FormDialogRender.setFormProps({ disabled: true })
    FormDialogRender.setDialogProps({ confirmBtnProps: { loading: true } })

    if (updateDeptId.value === null) {
      await addDeptRequest(res)
    } else {
      await updateDeptRequest({
        ...res,
        id: updateDeptId.value,
      })
    }

    FormDialogRender.close()

    reload()
  } finally {
    FormDialogRender.setFormProps({ disabled: false })
    FormDialogRender.setDialogProps({ confirmBtnProps: { loading: false } })
  }
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
