<template>
  <span @click="handleClick">
    <span class="i-icon-park-outline:setting-two"></span>
    <BasicDrawer
      direction="rtl"
      :title="t('layout.setting.title')"
      :size="320"
      append-to-body
      destroy-on-close
      :show-cancel-btn="false"
      :show-confirm-btn="false"
      @register="register"
    >
      <div class="w-full overflow-hidden text-black flex flex-col">
        <ElDivider>{{ t('layout.setting.darkMode') }}</ElDivider>
        <AppDarkModeToggle class="text-2xl" />

        <ElDivider>{{ t('layout.setting.navMode') }}</ElDivider>
        <MenuModePicker :def="getMenuMode" @change="handleMenuModeChange" />

        <ElDivider>{{ t('layout.setting.sysTheme') }}</ElDivider>
        <ThemeColorPicker
          :color-list="APP_PRESET_COLOR_LIST"
          :cursor="getThemeColor"
          @change="handleSystemThemeChange"
        />

        <ElDivider>{{ t('layout.setting.headerTheme') }}</ElDivider>
        <ThemeColorPicker
          :color-list="HEADER_PRESET_BG_COLOR_LIST"
          :cursor="getHeaderBgColor"
          @change="handleHeaderBgChange"
        />

        <ElDivider>{{ t('layout.setting.sidebarTheme') }}</ElDivider>
        <ThemeColorPicker
          :color-list="SIDE_BAR_BG_COLOR_LIST"
          :cursor="getSideMenuBgColor"
          @change="handleSideMenuBgChange"
        />

        <ElDivider>{{ t('layout.setting.interfaceFunction') }}</ElDivider>
        <SwitchItem
          :title="t('layout.setting.menuCollapse')"
          :def="getCollapsed"
          @change="handleMenuCollapsedChange"
          :disabled="disableSidebarRelSetting && !getIsMobile"
        />
        <SwitchItem
          :title="t('layout.setting.menuAccordion')"
          :def="getUniqueOpened"
          @change="handleMenuUniqueOpenChange"
          :disabled="disableSidebarRelSetting && !getIsMobile"
        />
        <SwitchItem
          :title="t('layout.setting.fixedHeader')"
          :def="getFixed"
          @change="handleHeaderFixedChange"
        />
        <SelectItem
          :title="t('layout.setting.menuCollapseButton')"
          :cursor="getMenuTrigger"
          :options="menuCollapseButtonOptions"
          @change="handleMenuCollapsedButtonChange"
        />
        <SelectItem
          :title="t('layout.setting.topMenuLayout')"
          :options="topMenuAlignOptions"
          :cursor="getTopMenuAlign"
          :disabled="!disableSidebarRelSetting"
          @change="handleTopMenuAlignModeChange"
        />
        <SelectItem
          :title="t('layout.setting.contentAreaWidth')"
          :options="contentModeOptions"
          :cursor="getContentMode"
          @change="handleContentModeChange"
        />

        <ElDivider>{{ t('layout.setting.interfaceDisplay') }}</ElDivider>
        <SwitchItem
          :title="t('layout.setting.logo')"
          :def="getShowLogo"
          @change="handleLogoChange"
        />
        <SwitchItem
          :title="t('layout.setting.footer')"
          :def="getShowFooter"
          @change="handleFooterChange"
        />
        <SwitchItem
          :title="t('layout.setting.fullContent')"
          :def="getFullContent"
          @change="handleFullContentChange"
        />
        <SwitchItem
          :title="t('layout.setting.grayMode')"
          :def="getGrayMode"
          @change="handleGrayModeChange"
        />
        <SwitchItem
          :title="t('layout.setting.colorWeakMode')"
          :def="getColorWeak"
          @change="handleColorWeakChange"
        />

        <ElDivider>{{ t('layout.setting.animation') }}</ElDivider>
        <SwitchItem
          :title="t('layout.setting.progress')"
          :def="getEnableNProgress"
          @change="handleEnableNProgressChange"
        />
        <SwitchItem
          :title="t('layout.setting.switchAnimation')"
          :def="getEnableTransition"
          @change="handleEnableTransitionChange"
        />
        <SelectItem
          :title="t('layout.setting.switchAnimationType')"
          :disabled="!getEnableTransition"
          :options="routerTransitionOptions"
          :cursor="getRouterTransition"
          @change="handleRouterTransitionChange"
        />
      </div>

      <SettingFooter v-if="isDevMode()" />
    </BasicDrawer>
  </span>
</template>

<script setup lang="ts">
import ThemeColorPicker from './components/ThemeColorPicker.vue'
import SwitchItem from './components/SwitchItem.vue'
import MenuModePicker from './components/MenuModePicker.vue'
import SettingFooter from './components/SettingFooter.vue'
import { BasicDrawer, useDrawer } from '/@/components/Drawer'

import { computed, nextTick } from 'vue'
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
import { ContentEnum, RouterTransitionEnum } from '/@/enums/appEnum'
import { MenuModeEnum, MenuTriggerEnum } from '/@/enums/menuEnum'
import { TopMenuAlign } from '/#/config'
import { useAppInject } from '/@/composables/core/useAppInject'
import { isDevMode } from '/@/utils/env'
import { useTransl } from '/@/composables/core/useTransl'

const { t } = useTransl()
const { getIsMobile } = useAppInject()

const [register, { openDrawer, closeDrawer }] = useDrawer()

function handleClick() {
  openDrawer()
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

const contentModeOptions: LabelValueOptions = [
  { label: t('layout.setting.contentModeFull'), value: ContentEnum.FULL },
  { label: t('layout.setting.contentModeFixed'), value: ContentEnum.FIXED },
]
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
  closeDrawer()

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
  getMenuTrigger,
  setMenuSetting,
} = useMenuSetting()
const disableSidebarRelSetting = computed(() => getMenuMode.value === MenuModeEnum.TOP_MENU)
const topMenuAlignOptions: LabelValueOptions = [
  { label: t('layout.setting.topMenuTypeLeft'), value: 'flex-start' },
  { label: t('layout.setting.topMenuTypeCenter'), value: 'center' },
  { label: t('layout.setting.topMenuTypeRight'), value: 'flex-end' },
]
const menuCollapseButtonOptions: LabelValueOptions = [
  { label: t('layout.setting.menuTriggerNone'), value: MenuTriggerEnum.NONE },
  { label: t('layout.setting.menuTriggerBottom'), value: MenuTriggerEnum.BOTTOM },
  { label: t('layout.setting.menuTriggerTop'), value: MenuTriggerEnum.TOP },
]
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
function handleMenuCollapsedButtonChange(trigger: MenuTriggerEnum) {
  setMenuSetting({ trigger })
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
