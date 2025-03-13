<template>
  <div v-if="availabilityEnabled" class="flex items-center relative">
    <span
      :class="[
        'w-3 h-3 rounded-full mr-2 cursor-pointer',
        availabilityColor
      ]"
      @mouseover="showAvailabilityName"
      @mouseleave="hideAvailabilityName"
      @click="showAvailabilityNameForTwoSeconds"
    />
    <transition name="fade">
      <span v-if="isAvailabilityNameVisible" class="absolute left-0 top-6 bg-white p-1 rounded shadow">
        {{ availabilityName }}
      </span>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { defineProps, ref, computed } from 'vue';
import type { AvailabilityBadgeProps } from './types';

const { product, useAvailability = false } = defineProps<AvailabilityBadgeProps>();

const availabilityEnabled = useAvailability;
const availabilityStyles = ref({});
const availabilityName = computed(() => productGetters.getAvailabilityName(product));
const isAvailabilityNameVisible = ref(false);

if (availabilityEnabled) {
  availabilityStyles.value = {
    backgroundColor: productGetters.getAvailabilityBackgroundColor(product),
    color: productGetters.getAvailabilityTextColor(product),
  };
}

const availabilityColor = computed(() => {
  const availability = productGetters.getAgenciesAvailabilityCLass(product);
  if (availability === 'availability-1') {
    return 'bg-green-500';
  } else if (availability === 'availability-2') {
    return 'bg-yellow-500';
  } else {
    return 'bg-red-500';
  }
});

const showAvailabilityName = () => {
  isAvailabilityNameVisible.value = true;
};

const hideAvailabilityName = () => {
  isAvailabilityNameVisible.value = false;
};

const showAvailabilityNameForTwoSeconds = () => {
  showAvailabilityName();
  setTimeout(() => {
    hideAvailabilityName();
  }, 2000);
};
</script>

<style scoped>
.bg-green-500 {
  background-color: #48bb78;
}
.bg-yellow-500 {
  background-color: #ecc94b;
}
.bg-red-500 {
  background-color: #f56565;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>