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
        />
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import type { BasicColumn } from '/@/components/Table'

import { nextTick, ref } from 'vue'
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
      reload({ page: 1 })
    }
  })
}

const setColumns = ref<BasicColumn[]>([
  {
    label: t('views.param.config.set'),
    prop: 'name',
  },
])
</script>
