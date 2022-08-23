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
              :disabled="currentDictInfo.parentId === null"
              @click="openEditDictDataFormDialog()"
            >
              {{ t('common.basic.add') }}
            </ElButton>
          </template>

          <template #action="{ row }">
            <ElButton type="primary" link @click="openEditDictDataFormDialog(row)">{{
              t('common.basic.edit')
            }}</ElButton>
            <ElButton type="danger" link @click="handleDeleteDict(row)">{{
              t('common.basic.delete')
            }}</ElButton>
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
  useGetDictListRequest,
  useGetDictDataPageRequest,
  useDeleteDictRequest,
} from '/@/api/config/dict.api'
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { useTransl } from '/@/composables/core/useTransl'
import IconFontistoSpinnerRefresh from '~icons/fontisto/spinner-refresh'
import IconFluentAdd12Filled from '~icons/fluent/add-12-filled'
import { createContextMenu } from '/@/components/ContextMenu'
import EditDictFormDialog from './components/EditDictFormDialog.vue'
import { useDialog } from '/@/components/Dialog'
import { DictValueTypes } from './DictValueType'

const { t } = useTransl()

const [getDictListRequest, _] = useGetDictListRequest()
const [getDictDataPageRequest, __] = useGetDictDataPageRequest()
const [deleteDictRequest, ___] = useDeleteDictRequest()

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
        label: t('common.basic.edit'),
        handler: () => {
          openEditDictFormDialog(row)
        },
      },
      {
        label: t('common.basic.delete'),
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
    label: t('views.config.dict.itemname'),
    prop: 'name',
    width: 220,
  },
  {
    label: t('views.config.dict.uniqueKey'),
    prop: 'uniqueKey',
    width: 120,
    align: 'center',
  },
  {
    label: t('views.config.dict.type'),
    prop: 'type',
    width: 200,
    align: 'center',
    formatter: (row: Recordable) => {
      return t(DictValueTypes.find((e) => e.value === row.type)!.label)
    },
  },
  {
    label: t('views.config.dict.value'),
    prop: 'value',
    width: 340,
    showTooltipWhenOverflow: true,
    align: 'center',
  },
  {
    align: 'center',
    label: t('common.basic.status'),
    prop: 'status',
    width: 120,
    formatter: (row: Recordable) => {
      return row.status === 0 ? t('common.basic.disabled') : t('common.basic.enable')
    },
  },
  {
    align: 'center',
    label: t('common.basic.sort'),
    width: 100,
    prop: 'orderNum',
  },
  {
    align: 'center',
    label: t('common.basic.remark'),
    prop: 'remark',
    width: 300,
    showTooltipWhenOverflow: true,
  },
  {
    align: 'center',
    label: t('common.basic.operation'),
    width: 140,
    fixed: 'right',
    slot: 'action',
  },
])

const setColumns = ref<BasicColumn[]>([
  {
    label: t('views.config.dict.name'),
    prop: 'name',
    renderHeader: ({ column }) => {
      return (
        <div class="flex flex-row">
          <span class="flex-1">{column.label}</span>
          <span class="px-1 cursor-pointer" onClick={() => openEditDictFormDialog()}>
            <IconFluentAdd12Filled />
          </span>
          <span class="ml-1 px-1 cursor-pointer" onClick={() => reloadDictTable()}>
            <IconFontistoSpinnerRefresh />
          </span>
        </div>
      )
    },
  },
])
</script>
