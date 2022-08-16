<template>
  <PageWrapper>
    <BasicTable
      class="p-1"
      :columns="columns"
      :api="processRequestData"
      :pagination="false"
      row-key="id"
      border
      @register="registerTable"
    >
      <!-- toolbar -->
      <template #toolbar>
        <ElButton type="primary" @click="openEditMenuFormDialog">
          {{ t('common.basic.create') }}
        </ElButton>
      </template>
      <!-- column -->
      <template #name="{ row }">
        {{ t(row.name) }}
        <ElTag v-if="row.isShow === 0 && row.type !== 2" type="danger">{{
          t('views.system.menu.menuHidden')
        }}</ElTag>
      </template>
      <template #type="{ row }">
        <ElTag>{{ formatterType(row.type) }}</ElTag>
      </template>
      <template #perms="{ row }">
        <ElTag v-for="item in row.perms" :key="item">{{ item }}</ElTag>
      </template>
      <template #icon="{ row }">
        <SvgIcon v-if="row.icon" :icon="row.icon" />
      </template>
    </BasicTable>

    <!-- form -->
    <EditMenuFormDialog @register="registerDialog" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { BasicColumn } from '/@/components/Table'

import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { ref } from 'vue'
import { getMenuList } from '/@/api/system/menu.api'
import { useTransl } from '/@/composables/core/useTransl'
import { listToTree } from '/@/utils/helper/tree'
import EditMenuFormDialog from './components/EditMenuFormDialog.vue'
import { useDialog } from '/@/components/Dialog'

const { t } = useTransl()

const [registerDialog, { openDialog }] = useDialog()

const [registerTable, { getDataSource }] = useTable()

function openEditMenuFormDialog() {
  openDialog({
    menus: getDataSource(),
  })
}
const [request, _] = getMenuList()

function formatterType(type: number) {
  switch (type) {
    case 0:
      return t('views.system.menu.menuTypeCatalogue')
    case 1:
      return t('views.system.menu.menuTypeMenu')
    case 2:
      return t('views.system.menu.menuTypePermission')
  }
}

async function processRequestData() {
  const { list } = await request()
  return listToTree(list)
}
const columns = ref<BasicColumn[]>([
  {
    width: 300,
    label: t('views.system.menu.name'),
    prop: 'name',
    slot: 'name',
  },
  {
    align: 'center',
    width: 120,
    label: t('views.system.menu.type'),
    prop: 'type',
    slot: 'type',
  },
  {
    width: 80,
    align: 'center',
    label: t('views.system.menu.icon'),
    prop: 'icon',
    slot: 'icon',
  },
  {
    align: 'center',
    label: t('views.system.menu.router'),
    prop: 'router',
    showTooltipWhenOverflow: true,
  },
  {
    align: 'center',
    label: t('views.system.menu.viewPath'),
    prop: 'viewPath',
    showTooltipWhenOverflow: true,
  },
  {
    width: 340,
    align: 'center',
    label: t('views.system.menu.perm'),
    prop: 'perms',
    slot: 'perms',
  },
  {
    width: 80,
    align: 'center',
    label: t('views.system.menu.orderNum'),
    prop: 'orderNum',
  },
])
</script>
