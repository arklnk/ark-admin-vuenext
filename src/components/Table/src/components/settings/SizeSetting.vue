<template>
  <ElDropdown @command="handleCommand" trigger="click">
    <span class="i-mdi:format-line-spacing"></span>
    <template #dropdown>
      <el-dropdown-item :disabled="isDisable('small')" command="small">
        {{ t('component.table.toolbar.desityCompact') }}
      </el-dropdown-item>
      <el-dropdown-item :disabled="isDisable('default')" command="default">
        {{ t('component.table.toolbar.desityDefault') }}
      </el-dropdown-item>
      <el-dropdown-item :disabled="isDisable('large')" command="large">
        {{ t('component.table.toolbar.desityLoose') }}
      </el-dropdown-item>
    </template>
  </ElDropdown>
</template>

<script setup lang="ts">
import type { SizeType } from '/#/config'

import { useTableContext } from '../../composables/useTableContext'
import projectSetting from '/@/settings/projectSetting'
import { useTransl } from '/@/composables/core/useTransl'

const { t } = useTransl()

const table = useTableContext()

function isDisable(size: SizeType) {
  const tableSize = table.getSize() || projectSetting.elementUISetting.size
  return tableSize === size
}

function handleCommand(command: SizeType) {
  table.setProps({
    size: command,
  })
}
</script>
