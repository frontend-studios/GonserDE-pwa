<template>
  <div class="flex-col h-full flex relative scroll-smooth md:gap-4" data-testid="gallery">
    <div
      class="after:block after:pt-[100%] flex-1 relative overflow-hidden w-full max-h-[600px] group"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <SfScrollable
        class="flex items-center snap-x snap-mandatory scrollbar-hidden w-full h-full"
        wrapper-class="!absolute top-0 left-0 w-full h-full gallery-wrap border-25"
        buttons-placement="none"
        :active-index="activeIndex"
        is-active-index-centered
        :drag="{ containerWidth: true }"
        @on-scroll="onScroll"
      >
        <transition :name="transitionName" mode="out-in">
          <img
            :key="lightboxIndex"
            :src="productImageGetters.getImageUrl(images[lightboxIndex])"
            class="max-w-full max-h-screen border-25"
            @click="openLightbox(lightboxIndex)"
          />
        </transition>
      </SfScrollable>

      <!-- Previous and Next Buttons -->
      <button
        v-if="lightboxIndex > 0"
        class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black text-white opacity-0 group-hover:opacity-60 transition-opacity"
        @click="prevImage"
      >
        <SfIconChevronLeft size="2xl" />
      </button>
      <button
        v-if="lightboxIndex < images.length - 1"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white opacity-0 group-hover:opacity-60 transition-opacity"
        @click="nextImage"
      >
        <SfIconChevronRight size="2xl" />
      </button>

      <!-- Dots Navigation -->
      <div
        v-if="images.length > 1"
        class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center z-10"
        style="width: calc(5 * 1.5rem); overflow: hidden;"
      >
        <transition-group name="dot" tag="div" class="flex">
          <span
            v-for="(index) in visibleDots"
            :key="`dot-${index}`"
            class="w-3 h-3 mx-1 rounded-full cursor-pointer dot"
            :class="{ 'bg-primary-800': lightboxIndex === index, 'bg-primary-500': lightboxIndex !== index }"
            @click="onChangeIndex(index)"
          />
        </transition-group>
      </div>
    </div>

    <!-- Thumbnail List -->
    <div class="flex mt-4 overflow-x-auto">
      <img
        v-for="(image, index) in images"
        :key="`thumb-${index}`"
        :src="productImageGetters.getImageUrl(image)"
        class="w-20 h-20 object-cover cursor-pointer mx-1"
        :class="{ 'border-2 border-primary-500': lightboxIndex === index }"
        @click="onChangeIndex(index)"
      />
    </div>
  </div>
  <NuxtLazyHydrate when-visible>
    <transition name="fade-overlay">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 bg-gray-100 flex flex-col items-center justify-center z-50"
        @click="closeLightbox"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div class=" max-w-3xl" @click.stop>
          <button class="absolute top-2 right-2" @click="closeLightbox">
            <SfIconClose size="xl" />
          </button>
          <button
            v-if="lightboxIndex > 0"
            class="absolute left-2 top-1/2 transform -translate-y-1/2"
            @click="prevImage"
          >
            <SfIconChevronLeft size="2xl" />
          </button>
          <button
            v-if="lightboxIndex < images.length - 1"
            class="absolute right-2 top-1/2 transform -translate-y-1/2"
            @click="nextImage"
          >
            <SfIconChevronRight size="2xl" />
          </button>
          <transition :name="transitionName" mode="out-in">
            <img
              :key="lightboxIndex"
              :src="productImageGetters.getImageUrl(images[lightboxIndex])"
              class="max-w-full max-h-screen border-25"
            />
          </transition>
          <div class="mt-2 text-center">Bild {{ lightboxIndex + 1 }} von {{ images.length }}</div>
        </div>
      </div>
    </transition>
  </NuxtLazyHydrate>
</template>

<script setup lang="ts">
import { SfScrollable, SfIconChevronLeft, SfIconChevronRight, SfIconClose } from '@storefront-ui/vue';
import { productImageGetters } from '@plentymarkets/shop-api';
import { clamp, type SfScrollableOnScrollData } from '@storefront-ui/shared';
import { useTimeoutFn } from '@vueuse/core';
import type { ImagesData } from '@plentymarkets/shop-api';

const props = defineProps<{ images: ImagesData[] }>();

const { isPending, start, stop } = useTimeoutFn(() => {}, 50);
const activeIndex = ref(0);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const transitionName = ref('slide-left');

const onChangeIndex = (index: number) => {
  stop();
  activeIndex.value = clamp(index, 0, props.images.length - 1);
  lightboxIndex.value = activeIndex.value;
  start();
};

const onScroll = ({ left, scrollWidth }: SfScrollableOnScrollData) => {
  if (!isPending.value) onChangeIndex(Math.round(left / (scrollWidth / props.images.length)));
};

const openLightbox = (index: number) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};

const closeLightbox = () => {
  lightboxOpen.value = false;
};

const prevImage = () => {
  if (lightboxIndex.value > 0) {
    transitionName.value = 'slide-right';
    lightboxIndex.value--;
  }
};

const nextImage = () => {
  if (lightboxIndex.value < props.images.length - 1) {
    transitionName.value = 'slide-left';
    lightboxIndex.value++;
  }
};

// Swipe functionality
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // Minimum swipe distance in pixels
let isTouching = false; 

const handleTouchStart = (event: TouchEvent) => {
  touchStartX = event.changedTouches[0].screenX;
  touchEndX = touchStartX; 
  isTouching = true; 
};

const handleTouchMove = (event: TouchEvent) => {
  if (isTouching) {
    touchEndX = event.changedTouches[0].screenX;
  }
};

const handleTouchEnd = () => {
  if (isTouching) {
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance < 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    isTouching = false;
    touchEndX = 0;
  }
};

// Computed property for visible dots
const visibleDots = computed(() => {
  const totalDots = props.images.length;
  const maxDots = 5;
  const dots = [];

  if (totalDots <= maxDots) {
    return Array.from({ length: totalDots }, (_, i) => i);
  }

  if (lightboxIndex.value === 0) {
    return [0, 1, 2];
  }

  if (lightboxIndex.value === 1) {
    return [0, 1, 2, 3];
  }

  if (lightboxIndex.value === totalDots - 1) {
    return [totalDots - 3, totalDots - 2, totalDots - 1];
  }

  if (lightboxIndex.value === totalDots - 2) {
    return [totalDots - 4, totalDots - 3, totalDots - 2, totalDots - 1];
  }

  const start = Math.max(0, lightboxIndex.value - 2);
  const end = Math.min(totalDots, lightboxIndex.value + 3);

  if (end - start < maxDots) {
    if (start === 0) {
      return Array.from({ length: maxDots }, (_, i) => i);
    }
    if (end === totalDots) {
      return Array.from({ length: maxDots }, (_, i) => totalDots - maxDots + i);
    }
  }

  for (let i = start; i < end; i++) {
    dots.push(i);
  }

  return dots;
});
</script>

<style scoped>
.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 200ms;
}
.slide-left-enter-from {
  transform: translateX(100%);
}
.slide-left-leave-to {
  transform: translateX(-100%);
}
.slide-left-enter-to, .slide-left-leave-from {
  transform: translateX(0);
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 200ms;
}
.slide-right-enter-from {
  transform: translateX(-100%);
}
.slide-right-leave-to {
  transform: translateX(100%);
}
.slide-right-enter-to, .slide-right-leave-from {
  transform: translateX(0);
}

.dot-enter-active, .dot-leave-active {
  transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
}
.dot-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.5);
}
.dot-leave-to {
  opacity: 0;
  transform: translateX(-100%) scale(0.5);
}
.dot-enter-to, .dot-leave-from {
  opacity: 1;
  transform: scale(1);
}

.dot-move {
  transition: transform 300ms;
}
</style>