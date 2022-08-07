<template>
  <ElTooltip content="密度" placement="top">
    <ElDropdown @command="handleCommand">
      <IconMdiFormatLineSpacing />
      <template #dropdown>
        <el-dropdown-item :disabled="isDisable('small')" command="small">紧凑</el-dropdown-item>
        <el-dropdown-item :disabled="isDisable('default')" command="default">默认</el-dropdown-item>
        <el-dropdown-item :disabled="isDisable('large')" command="large">宽松</el-dropdown-item>
      </template>
    </ElDropdown>
  </ElTooltip>
</template>

<script setup lang="ts">
import type { SizeType } from '/#/config'

import IconMdiFormatLineSpacing from '~icons/mdi/format-line-spacing'
import { useTableContext } from '../../composables/useTableContext'
import projectSetting from '/@/settings/projectSetting'

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
