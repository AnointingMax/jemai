export const SHIPPING = 25000;

export type OrderTotals = {
  subtotal: number;
  shipping: number;
  total: number;
};

export const bagTotals = (subtotal: number, empty: boolean): OrderTotals => {
  const shipping = empty ? 0 : SHIPPING;
  return { subtotal, shipping, total: subtotal + shipping };
};
