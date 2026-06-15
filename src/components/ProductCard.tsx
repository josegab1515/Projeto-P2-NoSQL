import { Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL, type Product } from "@/lib/products";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const soldOut = product.stock <= 0;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {soldOut && (
          <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-destructive">
            Esgotado hoje
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 p-5 pr-20">
        <h3 className="font-serif text-lg font-semibold text-bread leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-1 text-xl font-bold text-foreground">{formatBRL(product.price)}</div>
      </div>
      <button
        disabled={soldOut}
        onClick={() => {
          add(product.id);
          toast.success(`${product.name} adicionado`, { description: "No carrinho com carinho 🥖" });
        }}
        className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl btn-bakery px-3 py-2 text-[11px] font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        <span className="grid h-6 w-6 place-items-center rounded-md bg-cream/15">
          <Plus size={14} strokeWidth={3} />
        </span>
        Add
      </button>
    </article>
  );
}
