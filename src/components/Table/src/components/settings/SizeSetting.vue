<template>
  <ElTooltip content="密度" placement="top">
    <ElDropdown @command="handleCommand">
      <IconRiLineHeight />
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

import IconRiLineHeight from '~icons/ri/line-height'
import { useTableContext } from '../../composables/useTableContext'

const table = useTableContext()

function isDisable(size: SizeType) {
  return table.getSize() === size
}

function handleCommand(command: SizeType) {
  table.setProps({
    size: command,
  })
}
</script>
