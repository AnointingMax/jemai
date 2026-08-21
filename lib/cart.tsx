"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * One line in the bag. The id folds in the variant, so the same piece in two
 * colourways is two lines rather than a quantity of two.
 */
export type CartLine = {
  id: string;
  slug: string;
  name: string;
  image: string;
  colour: string;
  size: string | null;
  /** Naira, kept numeric so the subtotal is arithmetic and not string work. */
  amount: number;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (line: Omit<CartLine, "id" | "quantity"> & { quantity?: number }) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const lineId = (slug: string, colour: string, size: string | null) =>
  [slug, colour, size ?? "-"].join("/");

/**
 * In-memory only: nothing here survives a reload. Swap the state for the real
 * cart service — every consumer goes through `useCart`.
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  const add: CartContextValue["add"] = useCallback((line) => {
    const id = lineId(line.slug, line.colour, line.size);
    const quantity = line.quantity ?? 1;
    setLines((current) => {
      const existing = current.find((item) => item.id === id);
      if (!existing)
        return [...current, { ...line, id, quantity }];
      return current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + quantity } : item,
      );
    });
    setOpen(true);
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setLines((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((total, item) => total + item.quantity, 0);
    const subtotal = lines.reduce(
      (total, item) => total + item.amount * item.quantity,
      0,
    );
    return { lines, count, subtotal, open, setOpen, add, setQuantity, remove };
  }, [lines, open, add, setQuantity, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside a CartProvider");
  return context;
};
