<template>
  <div
    :class="prefixCls"
    class="relative h-full w-full bg-no-repeat bg-cover bg-gray-100 overflow-y-auto"
  >
    <header class="max-w-[800px] h-20 px-5 m-auto flex justify-end items-center text-base">
      <ElLink :underline="false" :href="GITHUB_URL" type="info" target="_blank">开源地址</ElLink>
      <AppLocalePicker class="ml-4 text-info" />
      <AppDarkModeToggle class="ml-4" />
    </header>
    <main class="max-w-[800px] m-auto pt-12 pb-6">
      <div class="relative w-[380px] rounded-lg mt-20 mx-auto p-10 box-border">
        <div class="pb-7 pt-2 text-center text-2xl font-semibold text-black dark:text-gray-400">
          账号登录
        </div>
        <AccountLoginForm />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AccountLoginForm from './AccountLoginForm.vue'
import { AppDarkModeToggle, AppLocalePicker } from '/@/components/Application'
import { GITHUB_URL } from '/@/settings/siteSetting'
import { useDesign } from '/@/composables/core/useDesign'

const { prefixCls } = useDesign('login')
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-login;

.#{$prefixCls} {
  background-image: url('/@/assets/svg/login-bg.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  background-color: #f0f2f5;
}

html.dark {
  .#{$prefixCls} {
    background-color: #2a2c2c;
  }
}
</style>
