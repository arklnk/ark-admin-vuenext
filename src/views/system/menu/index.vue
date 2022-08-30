<template>
  <PageWrapper>
    <BasicTable
      :columns="columns"
      :api="getMenuListRequest"
      :pagination="false"
      row-key="id"
      border
      @register="registerTable"
    >
      <!-- toolbar -->
      <template #toolbar>
        <ElButton
          type="primary"
          @click="openEditMenuFormDialog()"
          :disabled="!hasPermission(Api.add)"
        >
          新增
        </ElButton>
      </template>

      <!-- column -->
      <template #name="{ row }">
        {{ row.name }}
        <ElTag v-if="row.isShow === 0 && row.type !== 2" type="danger">隐藏</ElTag>
      </template>
      <template #type="{ row }">
        <ElTag>{{ formatterType(row.type) }}</ElTag>
      </template>
      <template #perms="{ row }">
        <ElTag v-for="item in row.perms" :key="item" class="mr-1 mt-0.75">{{ item }}</ElTag>
      </template>
      <template #icon="{ row }">
        <span v-if="row.icon" :class="`i-${row.icon}`"></span>
      </template>

      <template #action="{ row }">
        <ElButton
          type="primary"
          link
          @click="openEditMenuFormDialog(row)"
          :disabled="row.has === 0 || !hasPermission(Api.update)"
        >
          编辑
        </ElButton>
        <PopConfirmButton
          type="danger"
          link
          @click="handleDelete(row)"
          :disabled="!hasPermission(Api.delete)"
        >
          删除
        </PopConfirmButton>
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
import { getMenuListRequest, deleteMenuRequest, Api } from '/@/api/system/menu'
import EditMenuFormDialog from './components/EditMenuFormDialog.vue'
import { useDialog } from '/@/components/Dialog'
import { PopConfirmButton } from '/@/components/Button'
import { usePermission } from '/@/composables/core/usePermission'

const { hasPermission } = usePermission()

const [registerDialog, { openDialog }] = useDialog()

const [registerTable, { getDataSource, reload }] = useTable()

function openEditMenuFormDialog(update?: Recordable) {
  openDialog({
    list: getDataSource(),
    item: update,
  })
}

function formatterType(type: number) {
  switch (type) {
    case 0:
      return '目录'
    case 1:
      return '菜单'
    case 2:
      return '权限'
  }
}

async function handleDelete(row: Recordable) {
  await deleteMenuRequest({ id: row.id })
  reload()
}

const columns = ref<BasicColumn[]>([
  {
    width: 300,
    label: '菜单名称',
    prop: 'name',
    slot: 'name',
  },
  {
    align: 'center',
    width: 120,
    label: '类型',
    prop: 'type',
    slot: 'type',
  },
  {
    width: 80,
    align: 'center',
    label: '图标',
    prop: 'icon',
    slot: 'icon',
  },
  {
    align: 'center',
    label: '路由',
    prop: 'router',
    showTooltipWhenOverflow: true,
    minWidth: 240,
  },
  {
    align: 'center',
    label: '视图路径',
    prop: 'viewPath',
    showTooltipWhenOverflow: true,
    minWidth: 240,
  },
  {
    width: 340,
    align: 'center',
    label: '权限',
    prop: 'perms',
    slot: 'perms',
  },
  {
    width: 80,
    align: 'center',
    label: '排序',
    prop: 'orderNum',
  },
  {
    width: 140,
    align: 'center',
    label: '操作',
    slot: 'action',
    fixed: 'right',
  },
])
</script>
