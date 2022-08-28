<template>
  <ElDropdown trigger="click" @command="handleCommand">
    <span class="cursor-pointer flex items-center">
      <span class="i-bi:translate"></span>
      <span v-if="showText" class="ml-2">{{ getLocaleText }}</span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="locale in localeList"
          :key="locale.value"
          :command="locale.value"
          :disabled="getLocale === locale.value"
        >
          {{ locale.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </ElDropdown>
</template>

<script setup lang="ts">
import type { LocaleType } from '/#/config'

import { computed, unref } from 'vue'
import { useLocale } from '/@/locales/useLocale'
import { localeList } from '/@/settings/localeSetting'

const props = defineProps({
  reload: {
    type: Boolean,
    default: true,
  },
  showText: {
    type: Boolean,
    default: false,
  },
})

const { getLocale, changeLocale } = useLocale()

const getLocaleText = computed(() => {
  return localeList.find((i) => i.value === unref(getLocale))?.label
})

async function handleCommand(locale: LocaleType) {
  await changeLocale(locale)
  props.reload && location.reload()
}
</script>
