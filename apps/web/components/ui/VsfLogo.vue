<template>
  <picture>
    <template v-if="imageExtension === 'svg'">
      <NuxtImg
        ref="logo"
        :src="imagePath"
        :alt="`${{ storeName }} logo`"
        class="w-100 h-10 py-2 object-contain"
        width="150"
        height="40"
        preload
      />
    </template>
    <template v-else>
      <img
        id="logo"
        ref="logo"
        :src="imagePath"
        :alt="`${{ storeName }} logo`"
        :width="imgWidth"
        :height="imgHeight"
        class="max-h-[100px] max-w-[200px] object-contain"
        preload
      />
    </template>
  </picture>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const storeName = runtimeConfig.public.storeName;
const imageExtension = runtimeConfig.public.headerLogo.split('.').pop();
// const imagePath = '/images/logo.' + imageExtension;
const imagePath = 'https://cdn02.plentymarkets.com/jq1sy3y2mngj/frontend/Logo/gonser-notld-standard.svg';
const logo = ref<HTMLImageElement | null>(null);
const imgWidth = ref<string>('');
const imgHeight = ref<string>('');
onMounted(() => {
  if (logo.value) {
    imgWidth.value = logo.value.clientWidth + '';
    imgHeight.value = logo.value.clientHeight + '';
  }
});
</script>
