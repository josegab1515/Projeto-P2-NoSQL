import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-padaria.png";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre nós · Padaria Dom Quixote" },
      { name: "description", content: "Três gerações fazendo pão à moda antiga na Vila do Forno. Conheça a história e os valores da Padaria Dom Quixote." },
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
        <h1 className="mt-3 font-serif text-4xl md:text-5xl font-bold text-bread">Quem cuida do Sancho cuida do tempo.</h1>
      </div>
      <img src={heroImg} alt="Padaria tradicional" width={1536} height={1024} loading="lazy" className="mt-10 w-full rounded-2xl object-cover shadow-xl" />
      <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/85 font-serif">
        <p>
          <span className="float-left mr-2 font-serif text-6xl leading-[0.85] text-bread">E</span>m 1987, Seu Quixote — que de cavaleiro só tinha o apelido —
          acendeu pela primeira vez o forno a lenha herdado do sogro. Naquela manhã chuvosa, vendeu seis pães. Hoje vendemos seiscentos. Quase nada mudou.
        </p>
        <p>
          A farinha ainda vem do mesmo moinho de pedra na Serra da Mantiqueira. O sal ainda é marinho. O fermento, que batizamos de
          <strong className="text-bread"> Sancho</strong>, mora num pote de barro e completa 38 anos em março. Ele é alimentado três vezes por dia — mais cuidado do que muito cachorro recebe.
        </p>
        <p>
          Acreditamos que pão bom é pão lento. 36 horas de fermentação fria, mãos calejadas e um forno que nunca apaga de verdade. É assim que se faz.
          E é assim que vamos continuar fazendo, mesmo que o mundo todo prefira pressa.
        </p>
        <p className="text-right not-italic text-base text-muted-foreground">— Aurora & Dom Quixote (filho)</p>
      </div>
    </div>
  );
}
