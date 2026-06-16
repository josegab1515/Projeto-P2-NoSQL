import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-bread/95 text-cream">
      <div className="mx-auto max-w-7xl px-5 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-serif text-2xl">Padaria Dona Margarida</div>
          <p className="mt-3 text-sm text-cream/75 max-w-xs">
            Fermentação natural e ingredientes locais e selecionados. Feito à mão desde 1948.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-serif text-lg mb-3">Visite</div>
          <p className="text-cream/75 leading-relaxed">
            Rua Shunji Nishimura, 605<br />
            Distrito Industrial · Pompeia<br />
            Ter–Dom · 06h às 16h
          </p>
        </div>
        <div className="text-sm">
          <div className="font-serif text-lg mb-3">Atendimento</div>
          <p className="text-cream/75">contato@donamargarida.com.br</p>
          <p className="text-cream/75">(14) 3452-0000</p>
          <Link to="/admin" className="mt-6 inline-block text-[11px] uppercase tracking-[0.2em] text-cream/50 hover:text-cream transition-colors">
            Acesso Funcionários
          </Link>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-[11px] uppercase tracking-[0.2em] text-cream/40">
        © {new Date().getFullYear()} · Padaria com muita história e carinho
      </div>
    </footer>
  );
}
