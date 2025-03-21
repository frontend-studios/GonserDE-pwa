<template>
  <div class="border border-neutral-200 rounded-md hover:shadow-lg flex flex-col cardlink" data-testid="product-card">
    <div class="relative overflow-hidden">
      <UiBadges
        :class="['absolute', isFromWishlist ? 'mx-2' : 'm-2']"
        :product="product"
        :use-availability="isFromWishlist"
      />

      <SfLink
        :tag="NuxtLink"
        rel="preload"
        :to="productPath"
        :class="{ 'size-56': isFromSlider }"
        as="image"
        class="flex items-center justify-center"
      >
        <NuxtImg
          :src="imageUrl"
          :alt="imageAlt"
          :title="imageTitle"
          :loading="lazy && !priority ? 'lazy' : 'eager'"
          :fetchpriority="priority ? 'high' : 'auto'"
          :preload="priority || false"
          :width="getWidth()"
          :height="getHeight()"
          class="object-contain rounded-md aspect-square w-full"
          data-testid="image-slot"
        />
      </SfLink>

      <slot name="wishlistButton">
        <WishlistButton
          square
          class="absolute top-0 right-0 mr-2 mb-2 bg-white !rounded-full wishlist-button"
          :product="product"
          :class="{ 'visible': isWishlistItem(variationId) }"
        />
      </slot>
    </div>
    <div class="p-2 bg-gray-100 border-t border-neutral-200 typography-text-sm flex flex-col flex-auto">
      <div class="flex items-center justify-between pt-1 gap-1" :class="{ 'mb-2': !productGetters.getShortDescription(product) }">
        <SfRating size="xs" :half-increment="true" :value="rating ?? 0" :max="5" />
        <UiAvailabilityBadge :product="product" :use-availability="true" />
      </div>
      <SfLink :tag="NuxtLink" :to="productPath" class="no-underline font-bold" variant="secondary">
        {{ name }}
      </SfLink>
      <!-- <div
        v-if="productGetters.getShortDescription(product)"
        class="block py-2 font-normal typography-text-xs text-neutral-700 text-justify whitespace-pre-line break-words"
      >
        <span class="line-clamp-3">
          {{ productGetters.getShortDescription(product) }}
        </span>
      </div> -->
      <LowestPrice :product="product" />
      <div v-if="showBasePrice" class="mb-2">
        <BasePriceInLine :base-price="basePrice" :unit-content="unitContent" :unit-name="unitName" />
      </div>
      <div class="flex flex-col md:flex-row md:items-center mt-auto">
        <div class="flex flex-col">
          <span v-if="crossedPrice" class="typography-text-sm text-neutral-500 line-through">
            {{ n(crossedPrice, 'currency') }}
          </span>
          <span class="block pb-2 font-bold typography-text-xl" data-testid="product-card-vertical-price">
            <span v-if="!productGetters.canBeAddedToCartFromCategoryPage(product)" class="mr-1">
              {{ t('account.ordersAndReturns.orderDetails.priceFrom') }}
            </span>
            <span>{{ n(price, 'currency') }}</span>
            <span>{{ t('asterisk') }} </span>
          </span>
        </div>
        <div class="flex md:ml-auto">
          <UiButton
            v-if="productGetters.canBeAddedToCartFromCategoryPage(product)"
            size="sm"
            class="min-w-[50px] w-fit"
            data-testid="add-to-basket-short"
            :disabled="loading"
            @click="addWithLoader(Number(productGetters.getId(product)))"
          >
            <template v-if="!loading" #prefix>
              <SfIconShoppingCart size="sm" />
            </template>
            <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
            <!-- <span v-else>
              {{ t('addToCartShort') }}
            </span> -->
          </UiButton>
          <UiButton v-else type="button" :tag="NuxtLink" :to="productPath" size="sm" class="w-fit">
            <span>{{ t('showOptions') }}</span>
          </UiButton>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { SfLink, SfIconShoppingCart, SfLoaderCircular, SfRating, SfCounter } from '@storefront-ui/vue';
import type { ProductCardProps } from '~/components/ui/ProductCard/types';
import UiAvailabilityBadge from '~/components/ui/AvailabilityBadge/AvailabilityBadge.vue';
import { defaults } from '~/composables';

const localePath = useLocalePath();
const { t, n } = useI18n();
const {
  product,
  name,
  imageUrl,
  imageAlt = '',
  imageTitle,
  imageWidth,
  imageHeight,
  rating,
  // ratingCount,
  priority,
  lazy = true,
  unitContent,
  unitName,
  basePrice,
  showBasePrice,
  isFromWishlist = false,
  isFromSlider = false,
} = defineProps<ProductCardProps>();

const { data: categoryTree } = useCategoryTree();
const { openQuickCheckout } = useQuickCheckout();
const { addToCart } = useCart();
const { price, crossedPrice } = useProductPrice(product);
const { send } = useNotification();
const loading = ref(false);

const path = computed(() => productGetters.getCategoryUrlPath(product, categoryTree.value));
const productSlug = computed(() => productGetters.getSlug(product) + `_${productGetters.getItemId(product)}`);
const { isWishlistItem } = useWishlist();
const variationId = computed(() => productGetters.getVariationId(product));
const productPath = computed(() => localePath(`${path.value}/${productSlug.value}`));
const getWidth = () => {
  if (imageWidth && imageWidth > 0 && imageUrl.includes(defaults.IMAGE_LINK_SUFIX)) {
    return imageWidth;
  }
  return '';
};
const getHeight = () => {
  if (imageHeight && imageHeight > 0 && imageUrl.includes(defaults.IMAGE_LINK_SUFIX)) {
    return imageHeight;
  }
  return '';
};

const addWithLoader = async (productId: number, quickCheckout = true) => {
  loading.value = true;

  try {
    await addToCart({
      productId: productId,
      quantity: 1,
    });
    if (quickCheckout) {
      openQuickCheckout(product, 1);
    } else {
      send({ message: t('addedToCart'), type: 'positive' });
    }
  } finally {
    loading.value = false;
  }
};

const NuxtLink = resolveComponent('NuxtLink');
</script>
<style scoped>
.wishlist-button {
  visibility: hidden;
  transition: visibility 0.1s;
}

.wishlist-button.visible {
  visibility: visible;
}

.cardlink:hover .wishlist-button {
  visibility: visible;
}
</style>