<template>
  <span @click="handleClick">
    <IconSettings />

    <ElDrawer v-model="visibleRef" direction="rtl" title="项目配置" :size="300" append-to-body>
      <div class="w-full overflow-hidden">
        <ElDivider>导航栏模式</ElDivider>
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
          :disabled="disableSidebarRelSetting"
        />
        <SwitchItem
          title="侧边菜单手风琴模式"
          :def="getUniqueOpened"
          @change="handleMenuUniqueOpenChange"
          :disabled="disableSidebarRelSetting"
        />
        <SwitchItem title="固定顶栏" :def="getFixed" @change="handleHeaderFixedChange" />
        <SelectItem title="内容区域宽度" :options="contentModeOptions" :cursor="getContentMode" @change="handleContentModeChange" />

        <ElDivider>界面显示</ElDivider>
        <SwitchItem title="Logo" :def="getShowLogo" @change="handleLogoChange" />
        <SwitchItem title="页脚" :def="getShowFooter" @change="handleFooterChange" />
        <SwitchItem title="灰色模式" :def="getGrayMode" @change="handleGrayModeChange" />
        <SwitchItem title="色弱模式" :def="getColorWeak" @change="handleColorWeakChange" />

        <ElDivider>动画</ElDivider>
        <SwitchItem title="顶栏进度条" :def="getEnableNProgress" @change="handleEnableNProgressChange" />
        <SelectItem
          title="切换动画类型"
          :options="routerTransitionOptions"
          :cursor="getRouterTransition"
          @change="handleRouterTransitionChange"
        />
      </div>
    </ElDrawer>
  </span>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import IconSettings from '~icons/icon-park-outline/setting-two'
import { APP_PRESET_COLOR_LIST, HEADER_PRESET_BG_COLOR_LIST, SIDE_BAR_BG_COLOR_LIST } from '/@/settings/designSetting'

import ThemeColorPicker from './components/ThemeColorPicker.vue'
import SwitchItem from './components/SwitchItem.vue'
import MenuModePicker from './components/MenuModePicker.vue'

import { useRootSetting } from '/@/hooks/setting/useRootSetting'
import { updateTheme } from '/@/core/theme/updateTheme'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { updateGrayMode } from '/@/core/theme/updateGrayMode'
import { updateColorWeak } from '/@/core/theme/updateColorWeak'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
import { updateHeaderBgColor, updateSidebarBgColor } from '/@/core/theme/updateBackground'
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting'
import SelectItem from './components/SelectItem.vue'
import { ContentEnum, contentMap, RouterTransitionEnum } from '/@/enums/appEnum'
import { MenuModeEnum } from '/@/enums/menuEnum'

const visibleRef = ref(false)
function handleClick() {
  visibleRef.value = true
}

const { getThemeColor, getGrayMode, getColorWeak, getShowLogo, getShowFooter, getContentMode, setRootSetting } = useRootSetting()
const contentModeOptions: LabelValueOptions = Array.from(contentMap).map(([key, value]) => { return { label: value, value: key } })
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

const { getCollapsed, getUniqueOpened, getBgColor: getSideMenuBgColor, getMenuMode, setMenuSetting } = useMenuSetting()
const disableSidebarRelSetting = computed(() => getMenuMode.value === MenuModeEnum.TOP_MENU)
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
const { getEnableNProgress, getRouterTransition, setTransitionSetting } = useTransitionSetting()
function handleEnableNProgressChange(enableNProgress: boolean) {
  setTransitionSetting({ enableNProgress })
}
function handleRouterTransitionChange(routerTransition: RouterTransitionEnum) {
  setTransitionSetting({ routerTransition })
}
</script>
