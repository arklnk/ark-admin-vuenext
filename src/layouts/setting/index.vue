<template>
  <span :class="$attrs.class" class="inline-block" @click="handleClick">
    <IconSettings />
  </span>
  <ElDrawer v-model="visibleRef" direction="rtl" title="项目配置" :size="300" append-to-body>
    <div class="w-full overflow-hidden">
      <ElDivider>系统主题</ElDivider>
      <ThemeColorPicker
        :color-list="APP_PRESET_COLOR_LIST"
        :cursor="getThemeColor"
        @change="handleSystemThemeChange"
      />
      <ElDivider>界面功能</ElDivider>
      <SwitchItem title="折叠菜单" :def="getCollapsed" @change="handleMenuCollapsedChange" />
      <SwitchItem title="侧边菜单手风琴模式" :def="getUniqueOpened" @change="handleMenuUniqueOpenChange" />
      <SwitchItem title="固定顶部栏" :def="getFixed" @change="handleHeaderFixedChange" />
      <ElDivider>界面显示</ElDivider>
      <SwitchItem title="灰色模式" :def="getGrayMode" @change="handleGrayModeChange" />
      <SwitchItem title="色弱模式" :def="getColorWeak" @change="handleColorWeakChange" />
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconSettings from '~icons/icon-park-outline/setting-two'
import { APP_PRESET_COLOR_LIST } from '/@/settings/designSetting'

import ThemeColorPicker from './components/ThemeColorPicker.vue'
import SwitchItem from './components/SwitchItem.vue'

import { useRootSetting } from '/@/hooks/setting/useRootSetting'
import { updateTheme } from '/@/core/theme/updateTheme'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { updateGrayMode } from '/@/core/theme/updateGrayMode'
import { updateColorWeak } from '/@/core/theme/updateColorWeak'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'

const visibleRef = ref(false)
function handleClick() {
  visibleRef.value = true
}

const { getThemeColor, getGrayMode, getColorWeak, setRootSetting } = useRootSetting()
function handleSystemThemeChange(themeColor: string) {
  updateTheme(themeColor)
  setRootSetting({ themeColor })
}
function handleGrayModeChange(grayMode: boolean) {
  updateGrayMode(grayMode)
  setRootSetting({ grayMode })
}
function handleColorWeakChange(colorWeak: boolean) {
  updateColorWeak(colorWeak)
  setRootSetting({ colorWeak })
}

const { getCollapsed, getUniqueOpened, setMenuSetting } = useMenuSetting()
function handleMenuCollapsedChange(collapsed: boolean) {
  setMenuSetting({ collapsed })
}
function handleMenuUniqueOpenChange(uniqueOpened: boolean) {
  setMenuSetting({ uniqueOpened })
}

const { getFixed, setHeaderSetting } = useHeaderSetting()
function handleHeaderFixedChange(fixed: boolean) {
  setHeaderSetting({ fixed })
}
</script>
