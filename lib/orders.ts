export const SHIPPING = 0;

export type OrderTotals = {
  subtotal: number;
  shipping: number;
  total: number;
};

export const bagTotals = (subtotal: number): OrderTotals => ({
  subtotal,
  shipping: SHIPPING,
  total: subtotal + SHIPPING,
});
