<template>
  <ElInput
    type="text"
    clearable
    v-model="currentSelectRef"
    readonly
    :placeholder="t('component.icon.placeholder')"
  >
    <template #prepend>{{ prefix }}</template>

    <template #append>
      <ElPopover :width="280" trigger="click" placement="bottom">
        <template #reference>
          <ElButton>
            <span v-if="currentSelectRef" :class="`${prefix}${currentSelectRef}`"></span>
            <span v-else class="i-gg:menu-grid-r"></span>
          </ElButton>
        </template>

        <div class="flex flex-row px-1 mb-2">
          <ElInput
            :placeholder="t('component.icon.searchPlaceholder')"
            clearable
            v-model="searchRef"
            class="flex-1"
          />
          <ElButton text type="info" class="ml-1" @click="handleClear">清空</ElButton>
        </div>
        <ElScrollbar height="180px">
          <ul
            v-if="getIconsRef.length > 0"
            class="flex flex-wrap flex-row list-none px-0.25 m-1 text-sm"
          >
            <li
              v-for="icon in getIconsRef"
              :key="icon"
              @click="handleClick(icon)"
              class="w-1/8 inline-flex items-center justify-center border border-solid box-border mr-1 mb-1 p-2 cursor-pointer border-gray-200 hover:dark:border-primary hover:border-primary dark:border-dark-100"
            >
              <span :class="`${prefix}${icon}`"></span>
            </li>
          </ul>
          <ElEmpty v-else style="height: 180px" :image-size="60" />
        </ElScrollbar>
      </ElPopover>
    </template>
  </ElInput>
</template>

<script lang="tsx">
import { computed, defineComponent, ref, unref, watch, watchEffect } from 'vue'

import { useTransl } from '/@/composables/core/useTransl'
import iconData from '../data/icon.data'

export default defineComponent({
  name: 'IconPicker',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    prefix: {
      type: String,
      default: 'i-',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const currentSelectRef = ref('')
    const searchRef = ref('')

    const { t } = useTransl()

    const getIconsRef = computed((): string[] => {
      if (!unref(searchRef)) {
        return iconData
      }

      return iconData.filter((i) => i.includes(unref(searchRef)))
    })

    function handleClick(icon: string) {
      currentSelectRef.value = icon
    }

    function handleClear() {
      currentSelectRef.value = ''
    }

    watchEffect(() => {
      currentSelectRef.value = props.modelValue
    })

    watch(
      () => unref(currentSelectRef),
      (v) => {
        emit('update:modelValue', v)
        emit('change', v)
      }
    )

    return {
      currentSelectRef,
      searchRef,
      getIconsRef,
      handleClick,
      handleClear,
      t,
    }
  },
})
</script>
