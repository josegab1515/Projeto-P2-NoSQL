import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-padaria.png";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre nós · Padaria Dom Quixote" },
      { name: "description", content: "Três gerações fazendo pão com muito carinho." },
      { property: "og:title", content: "Sobre nós · Padaria Dom Quixote" },
      { property: "og:description", content: "A história da padaria que insiste em fazer pão com tempo." },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div className="animate-fade-up mx-auto max-w-4xl px-5 py-16">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-bread font-bold">Nossa história</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl font-bold text-bread">Aquecendo corações com nossas delícias.</h1>
      </div>
      <img src={heroImg} alt="Padaria tradicional" width={1536} height={1024} loading="lazy" className="mt-10 w-full rounded-2xl object-cover shadow-xl" />
      <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/85 font-serif">
        <p>
          <span className="float-left mr-2 font-serif text-6xl leading-[0.85] text-bread">T</span>udo começou em 1948, quando Dom Quixote e sua família decidiram
           transformar a paixão pela panificação em uma forma de sustento e, ao mesmo tempo, levar alegria para a vizinhança.
           A cada fornada, os aromas dos pães recém-saídos do forno enchiam as ruas e aqueciam os corações de quem passava por perto.
        </p>
        <p>
          O que começou como um pequeno negócio familiar cresceu ao longo dos anos sem perder sua essência. Hoje,
          <strong className="text-bread"> três gerações</strong> depois, continuamos honrando os ensinamentos de Dom Quixote, preparando pães, bolos e outras delícias com ingredientes selecionados, frescos e de alta qualidade. </p>
      </div>
    </div>
  );
}
