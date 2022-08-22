<template>
  <PageWrapper content-full-height fixed-height :content-background="false">
    <div class="flex flex-row h-full">
      <div class="h-full w-[320px] bg-comp mr-2">
        <BasicTable
          class="h-full"
          container-height-fixed
          :pagination="false"
          :api="getConfigSetRequest"
          :columns="setColumns"
          :table-setting="{ fullscreen: false }"
          highlight-current-row
          :show-table-setting="false"
          @fetch-success="handleFetchConfigSetSuccess"
          @register="registerSetTable"
          @current-change="handleSetChange"
        />
      </div>
      <div class="h-full flex-1 w-0 bg-comp">
        <BasicTable
          class="h-full"
          container-height-fixed
          :api="getConfigPageRequest"
          :immediate="false"
          @register="registerItemTable"
          :columns="itemColumns"
          :search-info="currentSetId"
        >
          <template #toolbar>
            <ElButton type="primary">{{ t('common.basic.add') }}</ElButton>
          </template>

          <template #action>
            <ElButton type="primary" link>{{ t('common.basic.edit') }}</ElButton>
            <ElButton type="danger" link>{{ t('common.basic.delete') }}</ElButton>
          </template>
        </BasicTable>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="tsx">
import type { BasicColumn } from '/@/components/Table'

import { nextTick, reactive, ref } from 'vue'
import { useGetConfigSetRequest, useGetConfigPageRequest } from '/@/api/param/config.api'
import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { useTransl } from '/@/composables/core/useTransl'

const { t } = useTransl()

const [getConfigSetRequest, _] = useGetConfigSetRequest()
const [getConfigPageRequest, __] = useGetConfigPageRequest()

const [registerSetTable, { setCurrentRow, getDataSource: getSetDataSource, getCurrentRow }] =
  useTable()
const [registerItemTable, { reload }] = useTable()

const currentSetId = reactive({
  parentId: null,
})

function handleFetchConfigSetSuccess() {
  nextTick(() => {
    const data = getSetDataSource()
    if (data.length > 0) {
      setCurrentRow(data[0])
    }
  })
}

function handleSetChange() {
  nextTick(() => {
    const parentId = getCurrentRow()?.id
    if (parentId) {
      currentSetId.parentId = parentId
      reload({ page: 1 })
    }
  })
}

const itemColumns = ref<BasicColumn[]>([
  {
    label: t('views.param.config.item'),
    prop: 'name',
    width: 220,
  },
  {
    label: t('views.param.config.uniqueKey'),
    prop: 'uniqueKey',
    width: 200,
    align: 'center',
  },
  {
    label: t('views.param.config.value'),
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
    label: t('views.param.config.set'),
    prop: 'name',
    renderHeader: ({ column }) => {

      return (
        <div class="flex flex-row">
          <span class="flex-1">{ column.label }</span>
          +
        </div>
      )
    }
  },
])
</script>
