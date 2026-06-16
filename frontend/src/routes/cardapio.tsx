import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/products";

export const Route = createFileRoute("/cardapio")({
  head: () => ({
    meta: [
      { title: "Cardápio do dia · Padaria Dona Margarida" },
      { name: "description", content: "O que saiu do forno hoje: pães de fermentação natural, doces de receita familiar e bebidas artesanais." },
      { property: "og:title", content: "Cardápio do dia · Padaria Dona Margarida" },
      { property: "og:description", content: "Pães, doces e bebidas frescos do dia." },
    ],
  }),
  component: CardapioPage,
});

function CardapioPage() {
  const [filter, setFilter] = useState<Category | "todos">("todos");

  const filtered = useMemo(
    () => (filter === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter],
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
          Cardápio
        </div>
        <h1 className="mt-4 font-serif text-4xl md:text-5xl font-bold text-bread">
          Os Melhores de Hoje
        </h1>
        <p className="mt-3 text-foreground/70"></p>
      </div>

      {/* Filtros */}
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

      {/* Grid by section */}
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
      </div>
    </div>
  );
}
