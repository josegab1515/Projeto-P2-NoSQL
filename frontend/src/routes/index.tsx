import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-padaria.png";
import { ArrowRight, Wheat, Clock, Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Padaria Dona Margarida · Pão artesanal de fermentação natural" },
      { name: "description", content: "Há três gerações fazendo pão à moda antiga." },
      { property: "og:title", content: "Padaria Dona Margarida" },
      { property: "og:description", content: "Pão de fermentação natural, doces de receita familiar e cafés artesanais." },
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
              alt="Família de padeiros sovando massa"
              width={1536}
              height={1024}
              className="w-full rounded-2xl object-cover shadow-2xl"
            />
            <div className="absolute -bottom-5 -right-5 hidden md:flex items-center gap-2 rounded-full bg-cream border border-border px-5 py-3 shadow-lg">
              <Wheat size={18} className="text-bread" />
              <span className="font-serif text-sm font-semibold text-bread">Desde 1948</span>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-bread/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-bread font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-bread" />
              Nossa História
            </div>
            <h1 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-bread leading-[1.05]">
              O pão <em className="not-italic text-primary">nosso</em> de cada dia.
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-foreground/80">
              Desde 1948, levamos sabor, tradição e carinho para a mesa de nossos clientes.
              Fundada por Dona Margarida e sua família, nossa padaria 
              atravessou gerações mantendo a qualidade dos ingredientes e o amor em cada receita. 
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <Stat icon={<Clock size={18} />} value="36h" label="de fermentação" />
              <Stat icon={<Wheat size={18} />} value="100%" label="natural" />
              <Stat icon={<Heart size={18} />} value="3" label="gerações" />
            </div>

            <Link
              to="/cardapio"
              className="mt-10 inline-flex items-center gap-3 rounded-2xl btn-bakery px-7 py-4 text-sm font-bold uppercase tracking-[0.15em]"
            >
              Nosso Cardápio
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Highlight bands */}
      <section className="paper-texture border-y border-border/50">
        <div className="mx-auto max-w-7xl px-5 py-12 grid gap-8 md:grid-cols-3 text-center">
          {[
            { t: "Delícia caseira", d: "Feitos à mão com amor." },
            { t: "Entrega quentinha", d: "Saiu do forno, partiu pra você." },
            { t: "Receita de família", d: "O caderno da Dona Margarida ainda dita o ponto da massa." },
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
