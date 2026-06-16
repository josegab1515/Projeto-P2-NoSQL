import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Seu carrinho · Padaria Dom Quixote" },
      { name: "description", content: "Revise seus pães, doces e bebidas antes de fechar o pedido." },
    ],
  }),
  component: CarrinhoPage,
});

function CarrinhoPage() {
  const { detailed, subtotal, setQty, remove } = useCart();
  const [cupom, setCupom] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const frete = subtotal > 0 ? 8.9 : 0;
  const total = Math.max(0, subtotal + frete - discount);

  const applyCupom = () => {
    if (cupom.trim().toUpperCase() === "SANCHO10") {
      const valorDesconto = subtotal * 0.1;
      setDiscount(valorDesconto);
      toast.success("Cupom aplicado!", { description: "10% de desconto garantido nos seus pães. 🥐" });
    } else {
      setDiscount(0);
      toast.error("Cupom inválido", { description: "Verifique o código digitado." });
    }
  };

  const handleAvancarParaCheckout = () => {
    // Monta a estrutura dos itens convertendo do formato do front para o esperado pelo seu FastAPI
    // CORREÇÃO: Mapeado de 'id' -> '_id' e de 'price' -> 'preco'
    const itensParaAPI = detailed.map(({ product, qty }) => ({
      produto_id: product._id,
      quantidade: qty,
      preco_unitario: Number(product.preco) || 0,
    }));

    // Guardamos o resumo temporariamente para a tela de checkout ler e enviar no POST /pedidos/
    localStorage.setItem(
      "dom_quixote_checkout_resumo",
      JSON.stringify({
        itens: itensParaAPI,
        total: total,
        desconto: discount,
      })
    );

    toast.success("Carrinho confirmed!", {
      description: "Vamos escolher os detalhes de entrega e pagamento. 🥖",
    });

    // Redireciona via programação para a rota de checkout
    navigate({ to: "/checkout" });
  };

  // Se o carrinho estiver vazio, exibe o estado amigável
  if (!detailed.length) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center animate-fade-up">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-bread/10 text-bread">
          <ShoppingBag size={32} />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-bold text-bread">Seu carrinho está vazio</h1>
        <p className="mt-2 text-muted-foreground">Que tal começar pelo pão do dia?</p>
        <Link
          to="/cardapio"
          className="mt-8 inline-flex items-center gap-2 rounded-xl btn-bakery px-6 py-3 text-sm font-bold uppercase tracking-wider"
        >
          Ver cardápio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 animate-fade-up">
      <h1 className="font-serif text-4xl font-bold text-bread">Seu Carrinho</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Listagem de Itens */}
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
          {detailed.map(({ product, qty, lineTotal }) => {
            // CORREÇÃO: Garante a coerência do preço numérico vindo da string do MongoDB
            const precoNum = Number(product.preco) || 0;

            return (
              <li key={product._id} className="grid grid-cols-[80px_1fr_auto] gap-4 p-4 items-center">
                <img src={product.imagem} alt={product.nome} className="h-20 w-20 rounded-xl object-cover" loading="lazy" />
                <div className="min-w-0">
                  <div className="font-serif font-semibold text-bread truncate">{product.nome}</div>
                  <div className="text-sm text-muted-foreground">{formatBRL(precoNum)} cada</div>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-border bg-background p-1">
                    <button
                      onClick={() => setQty(product._id, qty - 1)}
                      className="grid h-7 w-7 place-items-center rounded-full hover:bg-muted"
                      aria-label="Diminuir"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{qty}</span>
                    <button
                      onClick={() => setQty(product._id, qty + 1)}
                      className="grid h-7 w-7 place-items-center rounded-full hover:bg-muted"
                      aria-label="Aumentar"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{formatBRL(lineTotal)}</div>
                  <button
                    onClick={() => remove(product._id)}
                    className="mt-2 inline-flex items-center text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Resumo Financeiro */}
        <aside className="paper-texture rounded-2xl border border-border p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl font-bold text-bread">Resumo</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <Row label="Subtotal" value={formatBRL(subtotal)} />
            <Row label="Frete" value={formatBRL(frete)} hint="estimado p/ Vila do Forno" />
            {discount > 0 && <Row label="Desconto (SANCHO10)" value={`- ${formatBRL(discount)}`} accent />}
          </dl>

          {/* Seção de Cupom */}
          <div className="mt-5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Cupom de desconto</label>
            <div className="mt-2 flex gap-2">
              <input
                value={cupom}
                onChange={(e) => setCupom(e.target.value)}
                placeholder="Ex.: SANCHO10"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={applyCupom}
                className="rounded-lg border border-bread/40 px-4 text-sm font-semibold text-bread hover:bg-bread/10 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-baseline justify-between border-t border-border pt-4">
            <span className="font-serif text-lg text-bread">Total</span>
            <span className="font-serif text-3xl font-bold text-bread">{formatBRL(total)}</span>
          </div>

          {/* Botão de Ação Vinculado à Função da API */}
          <button
            onClick={handleAvancarParaCheckout}
            className="mt-6 flex items-center justify-center gap-2 rounded-xl btn-bakery px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] w-full transition-transform active:scale-[0.98]"
          >
            Pagar agora <ArrowRight size={16} />
          </button>

          <Link
            to="/cardapio"
            className="mt-3 block text-center text-xs uppercase tracking-wider text-muted-foreground hover:text-bread transition-colors"
          >
            ← continuar comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-foreground/80">
        {label}
        {hint && <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">{hint}</span>}
      </dt>
      <dd className={accent ? "font-semibold text-primary" : "font-semibold"}>{value}</dd>
    </div>
  );
}