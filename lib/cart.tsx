"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

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
  /**
   * The terms and conditions tick. It is taken in the cart sheet and carried
   * through to checkout, so a buyer who agreed on the way out of the bag does
   * not have to agree again in front of Pay Now.
   */
  consented: boolean;
  setConsented: (consented: boolean) => void;
  add: (line: Omit<CartLine, "id" | "quantity"> & { quantity?: number; }) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const lineId = (slug: string, colour: string, size: string | null) =>
  [slug, colour, size ?? "-"].join("/");

const STORAGE_KEY = "jemai.cart";

const EMPTY: CartLine[] = [];

let bag: CartLine[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

const readLines = () => {
  if (!hydrated) {
    hydrated = true;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) bag = JSON.parse(stored) as CartLine[];
    } catch {
      // A malformed or unavailable store just means an empty bag.
    }
  }
  return bag;
};

const writeLines = (next: CartLine[]) => {
  bag = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private-mode quota failures shouldn't break the cart.
  }
  listeners.forEach((notify) => notify());
};

const update = (change: (current: CartLine[]) => CartLine[]) =>
  writeLines(change(readLines()));

const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
};

export const CartProvider = ({ children }: { children: ReactNode; }) => {
  const lines = useSyncExternalStore(subscribe, readLines, () => EMPTY);
  const [open, setOpen] = useState(false);
  const [consented, setConsented] = useState(false);

  const add: CartContextValue["add"] = useCallback((line) => {
    const id = lineId(line.slug, line.colour, line.size);
    const quantity = line.quantity ?? 1;
    update((current) => {
      const existing = current.find((item) => item.id === id);
      if (!existing) return [...current, { ...line, id, quantity }];
      return current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + quantity } : item,
      );
    });
    setOpen(true);
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    update((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

  const remove = useCallback(
    (id: string) => update((current) => current.filter((item) => item.id !== id)),
    [],
  );

  const clear = useCallback(() => {
    writeLines([]);
    setConsented(false);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((total, item) => total + item.quantity, 0);
    const subtotal = lines.reduce(
      (total, item) => total + item.amount * item.quantity,
      0,
    );
    return {
      lines,
      count,
      subtotal,
      open,
      setOpen,
      consented,
      setConsented,
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, open, consented, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside a CartProvider");
  return context;
};
