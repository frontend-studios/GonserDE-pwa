<template>
    <div v-if="availabilityEnabled && availabilityName" class="flex items-center">
      <span
        :class="[
          'w-3 h-3 rounded-full mr-2',
          availabilityColor
        ]"
      />
      <!-- <SfListItem
        size="sm"
        class="text-xs font-medium select-none rounded-md !w-fit !cursor-text !px-2 grid mt-2"
        :class="[availabilityClass]"
        :style="availabilityStyles"
      >
        {{ availabilityName }}
      </SfListItem> -->
    </div>
  </template>
  
  <script setup lang="ts">
//   import { SfListItem } from '@storefront-ui/vue';
  import { productGetters } from '@plentymarkets/shop-api';
  import { defineProps, ref, computed } from 'vue';
  import type { AvailabilityBadgeProps } from './types';
  
  const { product, useAvailability = false } = defineProps<AvailabilityBadgeProps>();
  
  const availabilityEnabled = useAvailability;
  const availabilityStyles = ref({});
  const availabilityName = computed(() => productGetters.getAvailabilityName(product));
//   const availabilityClass = computed(() => productGetters.getAgenciesAvailabilityCLass(product));
  
  if (availabilityEnabled) {
    availabilityStyles.value = {
      backgroundColor: productGetters.getAvailabilityBackgroundColor(product),
      color: productGetters.getAvailabilityTextColor(product),
    };
  }
  
  const availabilityColor = computed(() => {
    const availability = productGetters.getAgenciesAvailabilityCLass(product);
    // eslint-disable-next-line no-console
    console.log("Availability for Product:", product, availability);
    if (availability === 'availability-1') {
      return 'bg-green-500';
    } else if (availability === 'availability-2') {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  });
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
  </style>