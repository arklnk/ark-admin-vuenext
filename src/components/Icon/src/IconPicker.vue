<template>
  <ElInput
    :class="$attrs.class"
    :style="$attrs.style"
    type="text"
    clearable
    v-model="currentSelectRef"
    readonly
    placeholder="请选择图标"
  >
    <template #prepend>{{ getIconPrefixRef }}</template>

    <template #append>
      <ElPopover :width="280" trigger="click" placement="bottom">
        <template #reference>
          <ElButton :icon="getActiveIconRef" />
        </template>

        <div class="flex flex-row px-1 mb-2">
          <ElInput placeholder="搜索图标" clearable v-model="searchRef" class="flex-1" />
          <ElButton text type="info" class="ml-1" @click="handleClear">清空</ElButton>
        </div>
        <ElScrollbar height="180px">
          <ul
            v-if="getSvgIconsRef.length > 0"
            class="flex flex-wrap flex-row list-none px-0.25 m-1 text-sm"
          >
            <li
              v-for="icon in getSvgIconsRef"
              :key="icon"
              @click="handleClick(icon)"
              class="w-1/8 inline-flex items-center justify-center border border-solid box-border mr-1 mb-1 p-2 cursor-pointer border-gray-200 hover:dark:border-primary hover:border-primary dark:border-dark-100"
            >
              <SvgIcon :icon="icon" />
            </li>
          </ul>
          <ElEmpty v-else style="height: 180px" :image-size="60" />
        </ElScrollbar>
      </ElPopover>
    </template>
  </ElInput>
</template>

<script lang="tsx">
import IconHealthiconsUiMenuGrid from '~icons/healthicons/ui-menu-grid'
import { computed, defineComponent, ref, unref, watch, watchEffect } from 'vue'

import svgIcons from 'virtual:svg-icons-names'

export default defineComponent({
  name: 'IconPicker',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    prefix: {
      type: String,
      default: 'icon',
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const currentSelectRef = ref('')
    const searchRef = ref('')

    const getIconPrefixRef = computed((): string => {
      return `${props.prefix}-`
    })

    const getSvgIconsRef = computed((): string[] => {
      const icons = svgIcons.map((icon) => icon.replace(unref(getIconPrefixRef), ''))

      if (!unref(searchRef)) {
        return icons
      }

      return icons.filter((i) => i.includes(unref(searchRef)))
    })

    const getActiveIconRef = computed(() => {
      if (unref(currentSelectRef)) {
        return <svg-icon icon={unref(currentSelectRef)} />
      }
      return IconHealthiconsUiMenuGrid
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
      getSvgIconsRef,
      getActiveIconRef,
      getIconPrefixRef,
      handleClick,
      handleClear,
    }
  },
})
</script>
