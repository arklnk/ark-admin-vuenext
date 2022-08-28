<template>
  <PageWrapper content-full-height fixed-height :content-background="false">
    <div class="flex flex-row h-full">
      <div class="h-full w-[320px] bg-comp mr-2">
        <BasicTable
          class="h-full"
          container-height-fixed
          :pagination="false"
          :api="getDictListRequest"
          :columns="setColumns"
          :table-setting="{ fullscreen: false }"
          highlight-current-row
          :show-table-setting="false"
          @fetch-success="handleFetchConfigSetSuccess"
          @register="registerDictTable"
          @current-change="handleDictChange"
          @row-contextmenu="handleDictRowContextmenu"
          :before-fetch="resetCurrentDictId"
        />
      </div>
      <div class="h-full flex-1 w-0 bg-comp">
        <BasicTable
          class="h-full"
          container-height-fixed
          :api="getDictDataPageRequest"
          :immediate="false"
          @register="registerItemTable"
          :columns="itemColumns"
          :search-info="currentDictInfo"
        >
          <template #toolbar>
            <ElButton
              type="primary"
              :disabled="currentDictInfo.parentId === null || !hasPermission(Api.add)"
              @click="openEditDictDataFormDialog()"
            >
              新增
            </ElButton>
          </template>

          <template #action="{ row }">
            <ElButton
              type="primary"
              link
              @click="openEditDictDataFormDialog(row)"
              :disabled="!hasPermission(Api.update)"
            >
              编辑
            </ElButton>
            <PopConfirmButton
              type="danger"
              link
              @click="handleDeleteDict(row)"
              :disabled="!hasPermission(Api.delete)"
            >
              删除
            </PopConfirmButton>
          </template>
        </BasicTable>
      </div>
    </div>

    <EditDictFormDialog @register="registerDialog" @success="handleEditSuccess" />
  </PageWrapper>
</template>

<script setup lang="tsx">
import type { BasicColumn } from '/@/components/Table'

import { nextTick, reactive, ref } from 'vue'
import {
  getDictListRequest,
  getDictDataPageRequest,
  deleteDictRequest,
  Api,
} from '/@/api/config/dict'
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { createContextMenu } from '/@/components/ContextMenu'
import EditDictFormDialog from './components/EditDictFormDialog.vue'
import { useDialog } from '/@/components/Dialog'
import { DictValueTypes } from './DictValueType'
import { PopConfirmButton } from '/@/components/Button'
import { usePermission } from '/@/composables/core/usePermission'

const { hasPermission } = usePermission()

const [
  registerDictTable,
  { setCurrentRow, getDataSource: getSetDataSource, getCurrentRow, reload: reloadDictTable },
] = useTable()

const [registerItemTable, { reload }] = useTable()

const [registerDialog, { openDialog }] = useDialog()

const currentDictInfo = reactive({
  parentId: null,
})

function openEditDictDataFormDialog(update?: Recordable) {
  openDialog({
    pid: currentDictInfo.parentId,
    item: update,
  })
}

function openEditDictFormDialog(update?: Recordable) {
  openDialog({
    pid: 0,
    item: update,
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

function handleDictRowContextmenu(row: Recordable, _: unknown, e: MouseEvent) {
  createContextMenu({
    width: 140,
    event: e,
    items: [
      {
        label: '编辑',
        disabled: !hasPermission(Api.update),
        handler: () => {
          openEditDictFormDialog(row)
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

function handleEditSuccess(id: number) {
  if (id === 0) {
    reloadDictTable()
  } else {
    reload({ page: 1 })
  }
}

const itemColumns = ref<BasicColumn[]>([
  {
    label: '字典项名称',
    prop: 'name',
    width: 220,
  },
  {
    label: '字典项标识',
    prop: 'uniqueKey',
    width: 120,
    align: 'center',
  },
  {
    label: '值类型',
    prop: 'type',
    width: 200,
    align: 'center',
    formatter: (row: Recordable) => {
      return DictValueTypes.find((e) => e.value === row.type)!.label
    },
  },
  {
    label: '字典项值',
    prop: 'value',
    width: 340,
    showTooltipWhenOverflow: true,
    align: 'center',
  },
  {
    align: 'center',
    label: '状态',
    prop: 'status',
    width: 120,
    formatter: (row: Recordable) => {
      return row.status === 0 ? '禁用' : '启用'
    },
  },
  {
    align: 'center',
    label: '排序',
    width: 100,
    prop: 'orderNum',
  },
  {
    align: 'center',
    label: '备注',
    prop: 'remark',
    width: 300,
    showTooltipWhenOverflow: true,
  },
  {
    align: 'center',
    label: '操作',
    width: 140,
    fixed: 'right',
    slot: 'action',
  },
])

const setColumns = ref<BasicColumn[]>([
  {
    label: '字典名称',
    prop: 'name',
    renderHeader: ({ column }) => {
      return (
        <div class="flex flex-row">
          <span class="flex-1">{column.label}</span>
          <span
            v-permission={Api.add}
            class="px-1 cursor-pointer"
            onClick={() => openEditDictFormDialog()}
          >
            <span class="i-fluent:add-12-filled" />
          </span>
          <span class="ml-1 px-1 cursor-pointer" onClick={() => reloadDictTable()}>
            <span class="i-fontisto:spinner-refresh" />
          </span>
        </div>
      )
    },
  },
])
</script>
