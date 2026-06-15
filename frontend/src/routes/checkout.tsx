import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CreditCard, QrCode, Banknote, X, Lock } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Pagamento · Padaria Dom Quixote" },
      { name: "description", content: "Informe seus dados e escolha como pagar." },
    ],
  }),
  component: CheckoutPage,
});

type PayMethod = "credito" | "pix" | "dinheiro";

function CheckoutPage() {
  const { detailed, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState<PayMethod>("credito");
  const [submitting, setSubmitting] = useState(false);
  const frete = subtotal > 0 ? 8.9 : 0;
  const total = subtotal + frete;

  if (!detailed.length) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-bread">Nada para pagar ainda</h1>
        <Link to="/cardapio" className="mt-6 inline-flex rounded-xl btn-bakery px-6 py-3 text-sm font-bold uppercase tracking-wider">
          Ir para o cardápio
        </Link>
      </div>
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const numero = `DQ-${Math.floor(Math.random() * 9000 + 1000)}`;
      clear();
      navigate({ to: "/pedido-confirmado", search: { numero, total } });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/55 backdrop-blur-sm p-4 sm:p-8 animate-fade-up">
      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-5xl bg-background rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-[1.2fr_1fr]"
      >
        {/* Esquerda - dados */}
        <div className="p-7 lg:p-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-bread font-bold">Checkout seguro</p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-bread">Informações de Pagamento</h2>
            </div>
            <Link to="/carrinho" aria-label="Fechar" className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted">
              <X size={18} />
            </Link>
          </div>

          <fieldset className="mt-8 space-y-4">
            <legend className="font-serif text-lg font-semibold text-bread mb-2">Dados pessoais</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nome completo" required placeholder="Como assina a entrega" />
              <Field label="E-mail" required type="email" placeholder="voce@email.com" />
              <Field label="Telefone" required placeholder="(11) 9 0000-0000" />
              <Field label="CEP" required placeholder="00000-000" />
            </div>
            <Field label="Rua e número" required placeholder="Rua das Espigas, 142" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Bairro" required placeholder="Vila do Forno" />
              <Field label="Complemento" placeholder="Apto, casa..." />
            </div>
          </fieldset>
        </div>

        {/* Direita - métodos */}
        <div className="paper-texture p-7 lg:p-10 border-t lg:border-t-0 lg:border-l border-border">
          <h3 className="font-serif text-xl font-bold text-bread">Escolha como Pagar</h3>
          <div className="mt-5 space-y-3">
            <PayOption icon={<CreditCard size={18} />} label="Cartão de Crédito" hint="Visa, Master, Elo" value="credito" active={method === "credito"} onChange={setMethod} />
            <PayOption icon={<QrCode size={18} />} label="Pix" hint="Aprovação imediata · 5% off" value="pix" active={method === "pix"} onChange={setMethod} />
            <PayOption icon={<Banknote size={18} />} label="Débito ou Dinheiro na entrega" hint="Pagamento na porta" value="dinheiro" active={method === "dinheiro"} onChange={setMethod} />
          </div>

          {method === "credito" && (
            <div className="mt-5 space-y-3 animate-fade-up">
              <Field label="Número do cartão" required placeholder="0000 0000 0000 0000" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Validade" required placeholder="MM/AA" />
                <Field label="CVV" required placeholder="123" />
              </div>
            </div>
          )}
          {method === "pix" && (
            <div className="mt-5 rounded-xl border border-border bg-card p-5 text-center animate-fade-up">
              <div className="mx-auto grid h-32 w-32 place-items-center rounded-xl bg-foreground text-background">
                <QrCode size={84} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">QR code dinâmico será gerado ao confirmar.</p>
            </div>
          )}
          {method === "dinheiro" && (
            <p className="mt-5 text-sm text-muted-foreground">Avise no campo de complemento se precisar de troco para alguma nota específica.</p>
          )}

          <div className="mt-7 rounded-xl bg-bread text-cream p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-cream/70 text-sm uppercase tracking-wider">Total a pagar</span>
              <span className="font-serif text-3xl font-bold">{formatBRL(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-xl btn-bakery px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] disabled:opacity-60"
          >
            {submitting ? "Processando..." : "Confirmar Pagamento"}
          </button>
          <p className="mt-3 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <Lock size={12} /> Pagamento criptografado · seus dados ficam com você
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function PayOption({
  icon, label, hint, value, active, onChange,
}: {
  icon: React.ReactNode; label: string; hint: string;
  value: PayMethod; active: boolean; onChange: (v: PayMethod) => void;
}) {
  return (
    <label
      className={[
        "flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all",
        active ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-bread/40",
      ].join(" ")}
    >
      <input type="radio" name="pay" value={value} checked={active} onChange={() => onChange(value)} className="sr-only" />
      <span className={["grid h-10 w-10 place-items-center rounded-lg", active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"].join(" ")}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <span className={["h-4 w-4 rounded-full border-2", active ? "border-primary bg-primary" : "border-border"].join(" ")} />
    </label>
  );
}
