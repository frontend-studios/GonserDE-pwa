import type { Product } from '@plentymarkets/shop-api';

export type AvailabilityBadgeProps = {
  product: Product;
  useAvailability: boolean;
};