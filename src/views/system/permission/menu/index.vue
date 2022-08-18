<template>
  <PageWrapper>
    <BasicTable
      :columns="columns"
      :api="processRequestData"
      :pagination="false"
      row-key="id"
      border
      @register="registerTable"
    >
      <!-- toolbar -->
      <template #toolbar>
        <ElButton type="primary" @click="openEditMenuFormDialog()">
          {{ t('common.basic.add') }}
        </ElButton>
      </template>
      <!-- column -->
      <template #name="{ row }">
        {{ t(row.name) }}
        <ElTag v-if="row.isShow === 0 && row.type !== 2" type="danger">{{
          t('common.basic.hidden')
        }}</ElTag>
      </template>
      <template #type="{ row }">
        <ElTag>{{ formatterType(row.type) }}</ElTag>
      </template>
      <template #perms="{ row }">
        <ElTag v-for="item in row.perms" :key="item" class="mr-0.5">{{ item }}</ElTag>
      </template>
      <template #icon="{ row }">
        <SvgIcon v-if="row.icon" :icon="row.icon" />
      </template>

      <template #action="{ row }">
        <ElButton type="primary" link @click.stop="handleUpdate(row)">{{
          t('common.basic.edit')
        }}</ElButton>
        <ElButton type="danger" link @click.stop="handleDelete(row)">{{
          t('common.basic.delete')
        }}</ElButton>
      </template>
    </BasicTable>

    <!-- form -->
    <EditMenuFormDialog @register="registerDialog" @success="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
import type { BasicColumn } from '/@/components/Table'

import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable } from '/@/components/Table'
import { ref } from 'vue'
import { useGetMenuListRequest, useDeleteMenuRequest } from '/@/api/system/menu.api'
import { useTransl } from '/@/composables/core/useTransl'
import { listToTree } from '/@/utils/helper/tree'
import EditMenuFormDialog from './components/EditMenuFormDialog.vue'
import { useDialog } from '/@/components/Dialog'

const { t } = useTransl()

const [registerDialog, { openDialog }] = useDialog()

const [registerTable, { getDataSource, reload }] = useTable()

function openEditMenuFormDialog(update?: Recordable) {
  openDialog({
    list: getDataSource(),
    item: update,
  })
}
const [menuListRequest, _] = useGetMenuListRequest()
const [deleteMenuRequest, __] = useDeleteMenuRequest()

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

function handleUpdate(row: Recordable) {
  openEditMenuFormDialog(row)
}

async function handleDelete(row: Recordable) {
  await deleteMenuRequest({ id: row.id })
  reload()
}

async function processRequestData() {
  const { list } = await menuListRequest()
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
  {
    width: 140,
    align: 'center',
    label: t('common.basic.operation'),
    slot: 'action',
    fixed: 'right',
  },
])
</script>
