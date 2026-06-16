import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, Mail } from "lucide-react";
import { z } from "zod";
import { formatBRL } from "@/lib/products";

const search = z.object({
  numero: z.string().default("DQ-0000"),
  total: z.coerce.number().default(0),
});

export const Route = createFileRoute("/pedido-confirmado")({
  validateSearch: search.parse,
  head: () => ({
    meta: [
      { title: "Pedido confirmado · Padaria Dona Margarida" },
      { name: "description", content: "Recebemos seu pedido com carinho." },
    ],
  }),
  component: ConfirmadoPage,
});

function ConfirmadoPage() {
  const { numero, total } = Route.useSearch();
  return (
    <div className="mx-auto max-w-2xl px-5 py-20 text-center animate-fade-up">
      <div className="relative mx-auto h-24 w-24">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
        <span className="relative grid h-24 w-24 place-items-center rounded-full bg-primary text-primary-foreground">
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </span>
      </div>
      <h1 className="mt-8 font-serif text-4xl md:text-5xl font-bold text-bread">Uhul! Seu pedido está a caminho!</h1>
      <p className="mt-4 text-foreground/75 max-w-md mx-auto">
        Recebemos seu pedido com carinho e já estamos embalando tudo.
      </p>

      <div className="mt-10 paper-texture rounded-2xl border border-border p-6 text-left">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Info label="Número do pedido" value={numero} />
          <Info label="Total pago" value={formatBRL(total)} />
          <Info label="Status" value="Confirmado" />
          <Info label="Prazo estimado" value="Em até 60 minutos" icon={<Clock size={14} />} />
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-lg bg-bread/10 px-4 py-3 text-sm text-bread">
          <Mail size={16} />
          Confirmação enviada para o e-mail cadastrado.
        </div>
      </div>

      <Link to="/cardapio" className="mt-10 inline-flex items-center gap-2 rounded-xl btn-bakery px-7 py-4 text-sm font-bold uppercase tracking-[0.15em]">
        Voltar para a Loja
      </Link>
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-1.5 font-serif text-lg font-semibold text-bread">{icon}{value}</div>
    </div>
  );
}
