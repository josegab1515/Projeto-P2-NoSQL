import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type APIProduct } from "./products";
import { apiService } from "../services/api"; // Importa o serviço que conecta ao FastAPI

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
  detailed: { product: APIProduct; qty: number; lineTotal: number }[];
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "dq-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [apiProducts, setApiProducts] = useState<APIProduct[]>([]);

  // 1. Carrega o carrinho salvo no localStorage do cliente
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // 2. Busca a lista atualizada de produtos direto do MongoDB para bater os preços reais
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await apiService.listarProdutos();
        setApiProducts(data);
      } catch (err) {
        console.error("Erro ao sincronizar produtos no carrinho:", err);
      }
    }
    fetchProducts();
  }, [items]); // Atualiza quando os itens mudam para garantir consistência de estoque/preço

  // 3. Salva as alterações do carrinho no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  // 4. Constrói as informações detalhadas cruzando os IDs do carrinho com os dados do banco
  const value = useMemo<CartCtx>(() => {
    const detailed = items
      .map((item) => {
        // Encontra o produto no array que veio da API do MongoDB usando o _id
        const product = apiProducts.find((p) => p._id === item.productId);
        if (!product) return null;
        
        // Converte o preço de string do banco para número para calcular o total da linha
        const precoNum = Number(product.preco) || 0;
        
        return { 
          product, 
          qty: item.qty, 
          lineTotal: precoNum * item.qty 
        };
      })
      .filter(Boolean) as { product: APIProduct; qty: number; lineTotal: number }[];

    const subtotal = detailed.reduce((sum, d) => sum + d.lineTotal, 0);
    const count = items.reduce((sum, i) => sum + i.qty, 0);

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
  }, [items, apiProducts]); // Recalcula sempre que os itens do carrinho ou os produtos da API mudarem

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}