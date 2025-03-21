<template>
  <div v-if="availabilityEnabled" class="flex items-center relative">
    <SfIconCheckCircle v-if="availability === 'availability-1'" size="xs" class="text-green-500 cursor-pointer" @mouseover="showAvailabilityName" @mouseleave="hideAvailabilityName" @click="showAvailabilityNameForTwoSeconds" />
    <span v-else-if="availability === 'availability-2'" class="bg-green-500 w-3 h-3 rounded-full mr-2 cursor-pointer" @mouseover="showAvailabilityName" @mouseleave="hideAvailabilityName" @click="showAvailabilityNameForTwoSeconds"/>
    <SfIconCheckCircle v-if="availability === 'availability-3'" size="xs" class="text-yellow-500 cursor-pointer" @mouseover="showAvailabilityName" @mouseleave="hideAvailabilityName" @click="showAvailabilityNameForTwoSeconds" />
    <span v-else-if="['availability-4', 'availability-5', 'availability-6', 'availability-7', 'availability-8', 'availability-9'].includes(availability)" class="bg-yellow-500 w-3 h-3 rounded-full mr-2 cursor-pointer" @mouseover="showAvailabilityName" @mouseleave="hideAvailabilityName" @click="showAvailabilityNameForTwoSeconds"/>
    <SfIconCancel v-if="['availability-10', 'availability-7', 'availability-8', 'availability-9'].includes(availability)" size="xs" class="text-red-500 cursor-pointer" @mouseover="showAvailabilityName" @mouseleave="hideAvailabilityName" @click="showAvailabilityNameForTwoSeconds" />
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
import { SfIconCheckCircle, SfIconCancel } from '@storefront-ui/vue';
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

const availability = computed(() => productGetters.getAgenciesAvailabilityCLass(product));

// const availabilityColor = computed(() => {
//   if (availability.value === 'availability-1' || availability.value === 'availability-2') {
//     return 'bg-green-500';
//   } else if (availability.value === 'availability-3' || ['availability-4', 'availability-5', 'availability-6'].includes(availability.value)) {
//     return 'bg-yellow-500';
//   } else {
//     return 'bg-red-500';
//   }
// });

// const showIcon = computed(() => {
//   return ['availability-1', 'availability-3', 'availability-7'].includes(availability.value);
// });

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
.bg-transparent {
  background-color: transparent;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>