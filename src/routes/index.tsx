import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-padaria.jpg";
import { ArrowRight, Wheat, Clock, Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Padaria Dom Quixote · Pão artesanal de fermentação natural" },
      { name: "description", content: "Há três gerações fazendo pão à moda antiga: 36 horas de fermentação, farinha de moinho de pedra e o forno a lenha aceso desde as quatro da manhã." },
      { property: "og:title", content: "Padaria Dom Quixote" },
      { property: "og:description", content: "Pão de fermentação natural, doces de receita antiga e cafés artesanais." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="animate-fade-up">
      {/* Nossa História */}
      <section className="mx-auto max-w-7xl px-5 pt-10 pb-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 paper-texture rounded-3xl -z-10 rotate-[-1.5deg]" />
            <img
              src={heroImg}
              alt="Família de padeiros sovando massa no forno tradicional"
              width={1536}
              height={1024}
              className="w-full rounded-2xl object-cover shadow-2xl"
            />
            <div className="absolute -bottom-5 -right-5 hidden md:flex items-center gap-2 rounded-full bg-cream border border-border px-5 py-3 shadow-lg">
              <Wheat size={18} className="text-bread" />
              <span className="font-serif text-sm font-semibold text-bread">Desde 1987</span>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-bread/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-bread font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-bread" />
              Nossa História
            </div>
            <h1 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-bread leading-[1.05]">
              O pão que <em className="not-italic text-primary">demora</em> é o pão que alimenta.
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-foreground/80">
              Em 1987, Seu Quixote acendeu o forno a lenha pela primeira vez numa esquina pacata da Vila do Forno.
              Três gerações depois, ainda acendemos antes do sol nascer. Nosso fermento — batizado de
              <strong className="text-bread"> Sancho</strong> — tem 38 anos e segue alimentando cada fornada
              com farinha de moinho de pedra, sal marinho e o tempo que o pão pede.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <Stat icon={<Clock size={18} />} value="36h" label="de fermentação" />
              <Stat icon={<Wheat size={18} />} value="100%" label="moinho de pedra" />
              <Stat icon={<Heart size={18} />} value="3" label="gerações" />
            </div>

            <Link
              to="/cardapio"
              className="mt-10 inline-flex items-center gap-3 rounded-2xl btn-bakery px-7 py-4 text-sm font-bold uppercase tracking-[0.15em]"
            >
              Ver Cardápio Delicioso
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Highlight bands */}
      <section className="paper-texture border-y border-border/50">
        <div className="mx-auto max-w-7xl px-5 py-12 grid gap-8 md:grid-cols-3 text-center">
          {[
            { t: "Farinha viva", d: "Moída em pedra a cada semana, direto do produtor da Serra da Mantiqueira." },
            { t: "Entrega quentinha", d: "Saiu do forno, partiu pra você. Em até 60 minutos na sua porta." },
            { t: "Receita de família", d: "O caderno da Dona Aurora ainda dita o ponto da massa." },
          ].map((b) => (
            <div key={b.t}>
              <h3 className="font-serif text-xl font-bold text-bread">{b.t}</h3>
              <p className="mt-2 text-sm text-foreground/70">{b.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-3">
      <div className="flex items-center justify-center text-bread">{icon}</div>
      <div className="mt-1 font-serif text-2xl font-bold text-bread leading-none">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
