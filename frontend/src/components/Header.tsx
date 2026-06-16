import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, Wheat } from "lucide-react";
import { useCart } from "@/lib/cart";

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border/60">
      <div className="mx-auto max-w-7xl grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bread text-cream">
            <Wheat size={20} />
          </span>
          <div className="min-w-0 leading-tight">
            <div className="font-serif text-lg font-bold text-bread truncate">Padaria Dom Quixote</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Artesanal · desde 1987</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-bread" }} className="hover:text-bread transition-colors">Home</Link>
          <Link to="/cardapio" activeProps={{ className: "text-bread" }} className="hover:text-bread transition-colors">Cardápio completo</Link>
          <Link to="/sobre" activeProps={{ className: "text-bread" }} className="hover:text-bread transition-colors">Sobre Nós</Link>
        </nav>

        <div className="flex items-center gap-1 justify-self-end">
          <button aria-label="Pesquisar" className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition-colors">
            <Search size={18} />
          </button>
          <Link 
            to="/admin" 
            aria-label="Conta" 
            className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition-colors"
          >
            <User size={18} />
          </Link>
          <Link to="/carrinho" aria-label="Carrinho" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition-colors">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
