// src/routes/cardapio.tsx (ou o caminho onde fica sua rota do TanStack Router)
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { apiService } from "@/services/api";
import { CATEGORIES, type Category, type Product, mapAPIProductToProduct } from "@/lib/products";

export const Route = createFileRoute("/cardapio")({
  head: () => ({
    meta: [
      { title: "Cardápio do dia · Padaria Dom Quixote" },
      { name: "description", content: "O que saiu do forno hoje: pães de fermentação natural, doces de receita antiga e bebidas artesanais." },
      { property: "og:title", content: "Cardápio do dia · Padaria Dom Quixote" },
      { property: "og:description", content: "Pães, doces e bebidas frescos do dia." },
    ],
  }),
  component: CardapioPage,
});

function CardapioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<Category | "todos">("todos");

  // Busca os produtos reais vindo da API FastAPI + MongoDB
  useEffect(() => {
    apiService.listarProdutos()
      .then((data) => {
        // Transforma os dados da API (como preço/estoque string e _id) para o formato do front
        const mappedProducts = data.map(mapAPIProductToProduct);
        setProducts(mappedProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar o cardápio da Dom Quixote:", err);
        setLoading(false);
      });
  }, []);

  // Filtra em cima da lista real de produtos carregados
  const filtered = useMemo(
    () => (filter === "todos" ? products : products.filter((p) => p.category === filter)),
    [filter, products],
  );

  const sections: { id: Category; label: string }[] = [
    { id: "paes", label: "Pães" },
    { id: "doces", label: "Doces" },
    { id: "bebidas", label: "Bebidas" },
  ];

  return (
    <div className="animate-fade-up mx-auto max-w-7xl px-5 py-12 lg:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-bread/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-bread font-bold">
          Fornada de hoje
        </div>
        <h1 className="mt-4 font-serif text-4xl md:text-5xl font-bold text-bread">
          Nosso Cardápio
        </h1>
      </div>

      {/* Filtros dinâmicos baseados no CATEGORIES do lib/products */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => {
          const active = filter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={[
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all border",
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card border-border hover:border-bread/40 hover:text-bread",
              ].join(" ")}
            >
              <span aria-hidden>{c.emoji}</span>
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Renderização condicional: Carregamento vs. Conteúdo Real */}
      {loading ? (
        <div className="mt-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-bread border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
            Buscando pães quentinhos no forno... 🥖
          </p>
        </div>
      ) : (
        /* Grid de Seções e Produtos da API */
        <div className="mt-12 space-y-14">
          {(filter === "todos" ? sections : sections.filter((s) => s.id === filter)).map((s) => {
            const items = filtered.filter((p) => p.category === s.id);
            if (!items.length) return null;
            
            return (
              <section key={s.id}>
                <h2 className="font-serif text-2xl font-bold text-bread mb-5 flex items-center gap-3">
                  <span>{s.label}</span>
                  <span className="flex-1 h-px bg-border" />
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            );
          })}
          
          {/* Caso nenhum produto corresponda ao filtro por falta de itens cadastrados */}
          {filtered.length === 0 && (
            <div className="mt-20 text-center text-muted-foreground">
              Nenhum item disponível nesta categoria no momento. 🥐
            </div>
          )}
        </div>
      )}
    </div>
  );
}