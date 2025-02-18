<template>
  <div :class="['flex flex-col md:flex-row items-stretch', positionClass]">
    <div v-if="viewport.breakpoint.value === 'md' || viewport.breakpoint.value === 'lg'" :class="['md:w-1/3', 'p-4', 'bg-gray-100', 'flex', 'items-center']">
      <TextContent :text="props.text" :button="props.button" />
    </div>
    <div :class="['md:w-2/3', 'flex-shrink-0']">
      <NuxtImg
        :src="getImageUrl()"
        :alt="props.image?.alt"
        :class="[
          'h-full',
          'object-cover',
          // { 'md:pr-4': props.image?.imageAlignment === 'left', 'md:pl-4': props.image?.imageAlignment === 'right' },
        ]"
        :width="getImageDimensions().width"
        :height="getImageDimensions().height"
      />
    </div>
    <div v-if="viewport.breakpoint.value !== 'md' && viewport.breakpoint.value !== 'lg'" :class="['md:w-1/3', 'p-4', 'bg-gray-100', 'flex', 'items-center']">
      <TextContent :text="props.text" :button="props.button" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageText12Props, ImageDimensions } from '~/components/ui/ImageText12/types';

const viewport = useViewport();

const props = defineProps<ImageText12Props>();

const positionClass = computed(() => (props.image?.imageAlignment === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'));

const getImageUrl = () => {
  switch (viewport.breakpoint.value) {
    case 'lg': {
      return props.image?.desktop;
    }
    case 'md': {
      return props.image?.tablet;
    }
    default: {
      return props.image?.mobile;
    }
  }
};

const getImageDimensions = (): ImageDimensions => {
  switch (viewport.breakpoint.value) {
    case 'lg': {
      return { width: 1200, height: 800 };
    }
    case 'md': {
      return { width: 800, height: 533 };
    }
    default: {
      return { width: 400, height: 267 };
    }
  }
};
</script>