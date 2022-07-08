<template>
  <span @click="handleClick">
    <IconSettings />
    <ElDrawer
      v-model="visibleRef"
      direction="rtl"
      title="项目配置"
      :size="320"
      append-to-body
      destroy-on-close
    >
      <div class="w-full overflow-hidden text-black flex flex-col">
        <ElDivider>风格设置</ElDivider>
        <AppDarkModeToggle class="text-2xl" />

        <ElDivider>导航模式</ElDivider>
        <MenuModePicker :def="getMenuMode" @change="handleMenuModeChange" />

        <ElDivider>系统主题</ElDivider>
        <ThemeColorPicker
          :color-list="APP_PRESET_COLOR_LIST"
          :cursor="getThemeColor"
          @change="handleSystemThemeChange"
        />

        <ElDivider>顶栏主题</ElDivider>
        <ThemeColorPicker
          :color-list="HEADER_PRESET_BG_COLOR_LIST"
          :cursor="getHeaderBgColor"
          @change="handleHeaderBgChange"
        />

        <ElDivider>菜单主题</ElDivider>
        <ThemeColorPicker
          :color-list="SIDE_BAR_BG_COLOR_LIST"
          :cursor="getSideMenuBgColor"
          @change="handleSideMenuBgChange"
        />

        <ElDivider>界面功能</ElDivider>
        <SwitchItem
          title="折叠菜单"
          :def="getCollapsed"
          @change="handleMenuCollapsedChange"
          :disabled="disableSidebarRelSetting && !getIsMobile"
        />
        <SwitchItem
          title="侧边菜单手风琴模式"
          :def="getUniqueOpened"
          @change="handleMenuUniqueOpenChange"
          :disabled="disableSidebarRelSetting && !getIsMobile"
        />
        <SwitchItem title="固定顶栏" :def="getFixed" @change="handleHeaderFixedChange" />
        <SelectItem
          title="顶部菜单布局"
          :options="topMenuAlignOptions"
          :cursor="getTopMenuAlign"
          :disabled="!disableSidebarRelSetting"
          @change="handleTopMenuAlignModeChange"
        />
        <SelectItem
          title="内容区域宽度"
          :options="contentModeOptions"
          :cursor="getContentMode"
          @change="handleContentModeChange"
        />

        <ElDivider>界面显示</ElDivider>
        <SwitchItem title="Logo" :def="getShowLogo" @change="handleLogoChange" />
        <SwitchItem title="页脚" :def="getShowFooter" @change="handleFooterChange" />
        <SwitchItem title="全屏内容" :def="getFullContent" @change="handleFullContentChange" />
        <SwitchItem title="灰色模式" :def="getGrayMode" @change="handleGrayModeChange" />
        <SwitchItem title="色弱模式" :def="getColorWeak" @change="handleColorWeakChange" />

        <ElDivider>动画</ElDivider>
        <SwitchItem
          title="顶栏进度条"
          :def="getEnableNProgress"
          @change="handleEnableNProgressChange"
        />
        <SwitchItem
          title="切换动画"
          :def="getEnableTransition"
          @change="handleEnableTransitionChange"
        />
        <SelectItem
          title="切换动画类型"
          :disabled="!getEnableTransition"
          :options="routerTransitionOptions"
          :cursor="getRouterTransition"
          @change="handleRouterTransitionChange"
        />
      </div>

      <SettingFooter v-if="isDevMode()" />
    </ElDrawer>
  </span>
</template>

<script setup lang="ts">
import IconSettings from '~icons/icon-park-outline/setting-two'
import ThemeColorPicker from './components/ThemeColorPicker.vue'
import SwitchItem from './components/SwitchItem.vue'
import MenuModePicker from './components/MenuModePicker.vue'
import SettingFooter from './components/SettingFooter.vue'

import { ref, computed, nextTick } from 'vue'
import {
  APP_PRESET_COLOR_LIST,
  HEADER_PRESET_BG_COLOR_LIST,
  SIDE_BAR_BG_COLOR_LIST,
} from '/@/settings/designSetting'
import { AppDarkModeToggle } from '/@/components/Application'
import { useRootSetting } from '/@/composables/setting/useRootSetting'
import { updateTheme } from '/@/logics/theme/updateTheme'
import { useMenuSetting } from '/@/composables/setting/useMenuSetting'
import { updateGrayMode } from '/@/logics/theme/updateGrayMode'
import { updateColorWeak } from '/@/logics/theme/updateColorWeak'
import { useHeaderSetting } from '/@/composables/setting/useHeaderSetting'
import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground'
import { useTransitionSetting } from '/@/composables/setting/useTransitionSetting'
import SelectItem from './components/SelectItem.vue'
import { ContentEnum, contentMap, RouterTransitionEnum, topMenuAlignMap } from '/@/enums/appEnum'
import { MenuModeEnum } from '/@/enums/menuEnum'
import { TopMenuAlign } from '/#/config'
import { useAppInject } from '/@/composables/core/useAppInject'
import { isDevMode } from '/@/utils/env'

const { getIsMobile } = useAppInject()

const visibleRef = ref(false)
function handleClick() {
  visibleRef.value = true
}

const {
  getThemeColor,
  getGrayMode,
  getColorWeak,
  getShowLogo,
  getShowFooter,
  getContentMode,
  getFullContent,
  setRootSetting,
} = useRootSetting()
const contentModeOptions: LabelValueOptions = Array.from(contentMap).map(([key, value]) => {
  return { label: value, value: key }
})
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
function handleLogoChange(showLogo: boolean) {
  setRootSetting({ showLogo })
}
function handleFooterChange(showFooter: boolean) {
  setRootSetting({ showFooter })
}
function handleContentModeChange(contentMode: ContentEnum) {
  setRootSetting({ contentMode })
}
function handleFullContentChange(fullContent: boolean) {
  visibleRef.value = false

  // wait for apply
  nextTick(() => {
    setRootSetting({ fullContent })
  })
}

const {
  getCollapsed,
  getUniqueOpened,
  getBgColor: getSideMenuBgColor,
  getMenuMode,
  getTopMenuAlign,
  setMenuSetting,
} = useMenuSetting()
const disableSidebarRelSetting = computed(() => getMenuMode.value === MenuModeEnum.TOP_MENU)
const topMenuAlignOptions: LabelValueOptions = Array.from(topMenuAlignMap).map(([key, value]) => {
  return { label: value, value: key }
})
function handleMenuCollapsedChange(collapsed: boolean) {
  setMenuSetting({ collapsed })
}
function handleMenuUniqueOpenChange(uniqueOpened: boolean) {
  setMenuSetting({ uniqueOpened })
}
function handleSideMenuBgChange(bgColor: string) {
  updateSidebarBgColor(bgColor)
  setMenuSetting({ bgColor })
}
function handleMenuModeChange(menuMode: MenuModeEnum) {
  setMenuSetting({ menuMode })
}
function handleTopMenuAlignModeChange(topMenuAlign: TopMenuAlign) {
  setMenuSetting({ topMenuAlign })
}

const { getFixed, getBgColor: getHeaderBgColor, setHeaderSetting } = useHeaderSetting()
function handleHeaderFixedChange(fixed: boolean) {
  setHeaderSetting({ fixed })
}
function handleHeaderBgChange(bgColor: string) {
  updateHeaderBgColor(bgColor)
  setHeaderSetting({ bgColor })
}

const routerTransitionOptions: LabelValueOptions = Object.values(RouterTransitionEnum).map((e) => {
  return { label: e, value: e }
})
const { getEnableNProgress, getRouterTransition, getEnableTransition, setTransitionSetting } =
  useTransitionSetting()
function handleEnableNProgressChange(enableNProgress: boolean) {
  setTransitionSetting({ enableNProgress })
}
function handleRouterTransitionChange(routerTransition: RouterTransitionEnum) {
  setTransitionSetting({ routerTransition })
}
function handleEnableTransitionChange(enable: boolean) {
  setTransitionSetting({ enable })
}
</script>
