import { Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL, type Product } from "@/lib/products";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  // 1. Buscamos a função 'add' e a lista de 'items' para saber o que já está no carrinho
  const { add, items } = useCart();
  
  const soldOut = product.stock <= 0;

  // 2. Descobre quantos deste produto específico já foram adicionados ao carrinho
  const cartItem = items?.find((item) => item.productId === product.id);
  const quantityInCart = cartItem ? cartItem.qty : 0;

  // 3. Verifica se a quantidade no carrinho já atingiu o limite máximo do estoque
  const reachedStockLimit = quantityInCart >= product.stock;

  const handleAddToCart = () => {
    if (reachedStockLimit) {
      toast.error("Limite atingido", {
        description: `Você já adicionou todas as ${product.stock} unidades disponíveis no carrinho.`,
      });
      return;
    }

    add(product.id);
    toast.success(`${product.name} adicionado`, {
      description: "No carrinho com carinho 🥖",
    });
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {soldOut ? (
          <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-destructive">
            Esgotado hoje
          </span>
        ) : product.stock <= 3 ? (
          // Alerta visual discreto se o estoque estiver quase acabando
          <span className="absolute top-3 left-3 rounded-full bg-amber-500 text-white px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold animate-pulse">
            Últimas unidades
          </span>
        ) : null}
      </div>
      
      {/* Aumentei o espaçamento inferior para o texto do estoque não colidir com o botão */}
      <div className="flex flex-col gap-2 p-5 pr-20 pb-7">
        <h3 className="font-serif text-lg font-semibold text-bread leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        
        <div className="mt-1 flex items-baseline gap-2 justify-between">
          <div className="text-xl font-bold text-foreground">{formatBRL(product.price)}</div>
        </div>

        {/* 🚀 EXIBIÇÃO DO ESTOQUE NO CARD */}
        <div className="text-[11px] font-medium text-muted-foreground mt-1">
          {soldOut ? (
            <span className="text-destructive font-semibold">Indisponível</span>
          ) : (
            <>
              Estoque: <span className="font-semibold text-foreground">{product.stock} un</span>
              {quantityInCart > 0 && (
                <span className="text-emerald-600 font-semibold ml-1">
                  ({quantityInCart} no carrinho)
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <button
        disabled={soldOut || reachedStockLimit}
        onClick={handleAddToCart}
        className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl btn-bakery px-3 py-2 text-[11px] font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        <span className="grid h-6 w-6 place-items-center rounded-md bg-cream/15">
          <Plus size={14} strokeWidth={3} />
        </span>
        🛒
      </button>
    </article>
  );
}