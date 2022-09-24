<template>
  <PageWrapper content-full-height fixed-height :content-background="false">
    <div class="flex flex-row h-full">
      <div class="h-full w-[320px] bg-comp mr-2">
        <BasicTable
          class="h-full"
          container-height-fixed
          :pagination="false"
          :api="getDictListRequest"
          :table-setting="{ fullscreen: false }"
          highlight-current-row
          :show-table-setting="false"
          @fetch-success="handleFetchConfigSetSuccess"
          @register="registerDictTable"
          @current-change="handleDictChange"
          @row-contextmenu="handleDictRowContextmenu"
          :before-fetch="resetCurrentDictId"
          :columns="createDictColumns()"
          row-key="id"
        >
          <template #dictHeader="{ column }">
            <div class="flex flex-row">
              <span class="flex-1">{{ column.label }}</span>
              <span
                v-permission="Api.add"
                class="px-1 cursor-pointer"
                @click="openEditDictFormDialog(false)"
              >
                <span class="i-fluent:add-12-filled"></span>
              </span>
              <span class="ml-1 px-1 cursor-pointer" @click="reloadDictTable()">
                <span class="i-fontisto:spinner-refresh"></span>
              </span>
            </div>
          </template>
        </BasicTable>
      </div>
      <div class="h-full flex-1 w-0 bg-comp">
        <BasicTable
          class="h-full"
          container-height-fixed
          :api="getDictDataPageRequest"
          :immediate="false"
          @register="registerItemTable"
          :search-info="currentDictInfo"
          row-key="id"
          :columns="createDictItemColumns()"
        >
          <template #toolbar>
            <ElButton
              type="primary"
              :disabled="currentDictInfo.parentId === null || !hasPermission(Api.add)"
              @click="openEditDictFormDialog(true)"
            >
              新增
            </ElButton>
          </template>

          <template #action="{ row }">
            <BasicTableAction
              :actions="[
                {
                  label: '编辑',
                  onClick: openEditDictFormDialog.bind(null, true, row),
                  disabled: !hasPermission(Api.update),
                },
                {
                  label: '删除',
                  popconfirm: true,
                  type: 'danger',
                  onClick: handleDeleteDict.bind(null, row),
                  disabled: !hasPermission(Api.delete),
                },
              ]"
            />
          </template>
        </BasicTable>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="tsx">
import type { ParamConfigResult } from '/@/api/config/dict'

import { nextTick, reactive, ref } from 'vue'
import {
  getDictListRequest,
  getDictDataPageRequest,
  deleteDictRequest,
  addDictRequest,
  updateDictRequest,
  Api,
} from '/@/api/config/dict'
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable, BasicTableAction } from '/@/components/Table'
import { createContextMenu } from '/@/components/ContextMenu'
import { usePermission } from '/@/composables/core/usePermission'
import { createDictColumns, createDictItemColumns } from './columns'
import { createDictSchemas } from './schemas'
import { createFormDialog } from '/@/components/Form'
import { omit } from 'lodash-es'

const { hasPermission } = usePermission()

const [
  registerDictTable,
  { setCurrentRow, getDataSource: getSetDataSource, getCurrentRow, reload: reloadDictTable },
] = useTable()

const [registerItemTable, { reload }] = useTable()

const fdInstance = createFormDialog({
  formProps: { labelWidth: '110px', schemas: createDictSchemas() },
  submit: async (
    res: Omit<ParamConfigResult, 'id' | 'parentId'>,
    { showLoading, hideLoading, close }
  ) => {
    try {
      showLoading()

      if (currentUpdateId.value === null) {
        await addDictRequest({
          ...res,
          parentId: currentParentId.value,
        })
      } else {
        await updateDictRequest({
          ...omit(res, 'uniqueKey'),
          id: currentUpdateId.value,
          parentId: currentParentId.value,
        })
      }

      close()

      if (currentParentId.value === 0) {
        reloadDictTable()
      } else {
        reload({ page: 1 })
      }
    } finally {
      hideLoading()
    }
  },
})

const currentDictInfo = reactive({
  parentId: null,
})

const currentUpdateId = ref<number | null>(null)
// 0 为新增或者更新字典
const currentParentId = ref<number>(0)

// 是否为更新字典项
function openEditDictFormDialog(isData: boolean, update?: Recordable) {
  fdInstance.open(({ getFormAction, getDialogAction }) => {
    // dict id
    currentParentId.value = isData ? currentDictInfo.parentId! : 0
    getDialogAction()?.setProps({
      title: currentParentId.value === 0 ? '编辑字典信息' : '编辑字典项信息',
    })

    getFormAction()?.updateSchema([
      {
        prop: 'type',
        hidden: !isData,
      },
      {
        prop: 'value',
        hidden: !isData,
      },
      {
        prop: 'status',
        hidden: !isData,
      },
      {
        prop: 'uniqueKey',
        disabled: !!update,
      },
    ])

    // is update
    if (update) {
      getFormAction()?.setFormModel(update)

      currentUpdateId.value = update.id
    } else {
      currentUpdateId.value = null
    }
  })
}

function resetCurrentDictId() {
  currentDictInfo.parentId = null
}

async function handleDeleteDict(row: Recordable) {
  await deleteDictRequest({
    id: row.id,
  })
  reloadDictTable()
}

function handleFetchConfigSetSuccess() {
  nextTick(() => {
    const data = getSetDataSource()
    if (data.length > 0) {
      setCurrentRow(data[0])
    }
  })
}

function handleDictChange() {
  nextTick(() => {
    const parentId = getCurrentRow()?.id
    if (parentId) {
      currentDictInfo.parentId = parentId
      reload({ page: 1 })
    }
  })
}

function handleDictRowContextmenu(row: Recordable, _, e: MouseEvent) {
  createContextMenu({
    width: 140,
    event: e,
    items: [
      {
        label: '编辑',
        disabled: !hasPermission(Api.update),
        handler: () => {
          openEditDictFormDialog(false, row)
        },
      },
      {
        label: '删除',
        disabled: !hasPermission(Api.delete),
        handler: async () => {
          handleDeleteDict(row)
        },
      },
    ],
  })
}
</script>
