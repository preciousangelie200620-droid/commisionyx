import { Artwork } from './artwork.model';

/**
 * A line item inside the shopping cart: one artwork plus a quantity.
 */
export interface CartItem {
  artwork: Artwork;
  quantity: number;
}

/**
 * The money breakdown shown on the cart and checkout pages.
 */
export interface OrderTotals {
  subtotal: number;
  commissionFee: number;
  tax: number;
  total: number;
}
