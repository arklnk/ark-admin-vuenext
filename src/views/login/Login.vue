<template>
  <div class="sf-login relative h-full w-full bg-no-repeat bg-cover bg-gray-100">
    <header class="max-w-[800px] h-20 px-5 m-auto flex justify-end items-center">
      <ElLink :underline="false" :href="GITHUB_URL" type="info" target="_blank">开源地址</ElLink>
    </header>
    <main class="max-w-[800px] m-auto pt-12 pb-6">
      <div class="relative w-[380px] bg-white rounded-lg mt-20 mx-auto h-20">
        form
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { GITHUB_URL } from '/@/settings/siteSetting'
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;

@include b(login) {
  background-image: url("/@/assets/svg/login-bg.svg");
}
</style>