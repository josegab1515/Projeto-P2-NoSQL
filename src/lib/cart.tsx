import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./products";

export interface CartItem {
  productId: string;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  detailed: { product: Product; qty: number; lineTotal: number }[];
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "dq-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    const detailed = items
      .map((i) => {
        const product = PRODUCTS.find((p) => p.id === i.productId);
        if (!product) return null;
        return { product, qty: i.qty, lineTotal: product.price * i.qty };
      })
      .filter(Boolean) as { product: Product; qty: number; lineTotal: number }[];
    const subtotal = detailed.reduce((s, d) => s + d.lineTotal, 0);
    const count = items.reduce((s, i) => s + i.qty, 0);
    return {
      items,
      add: (id) =>
        setItems((cur) => {
          const ex = cur.find((i) => i.productId === id);
          if (ex) return cur.map((i) => (i.productId === id ? { ...i, qty: i.qty + 1 } : i));
          return [...cur, { productId: id, qty: 1 }];
        }),
      remove: (id) => setItems((cur) => cur.filter((i) => i.productId !== id)),
      setQty: (id, qty) =>
        setItems((cur) =>
          qty <= 0
            ? cur.filter((i) => i.productId !== id)
            : cur.map((i) => (i.productId === id ? { ...i, qty } : i)),
        ),
      clear: () => setItems([]),
      count,
      subtotal,
      detailed,
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
