import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl font-bold text-bread">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Esta receita não está no cardápio</h2>
        <p className="mt-2 text-sm text-muted-foreground">A página que você procura saiu do forno cedo demais.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl btn-bakery px-5 py-3 text-sm font-bold uppercase tracking-wider"
          >
            Voltar para a vitrine
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl font-semibold">O forno deu um chiado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Algo não saiu como esperávamos. Tente de novo.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-xl btn-bakery px-5 py-3 text-sm font-bold uppercase tracking-wider"
          >
            Tentar novamente
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-medium hover:bg-muted">
            Ir para a Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Padaria Dona Margarida · Pão de fermentação natural" },
      { name: "description", content: "E-commerce da Padaria Artesanal Dona Margarida: pães de fermentação natural, doces de receita familiar e bebidas artesanais." },
      { name: "author", content: "Padaria Dona Margarida" },
      { property: "og:title", content: "Padaria Dona Margarida · Pão de fermentação natural" },
      { property: "og:description", content: "E-commerce da Padaria Artesanal Dona Margarida: pães de fermentação natural, doces de receita familiar e bebidas artesanais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Padaria Dona Margarida · Pão de fermentação natural" },
      { name: "twitter:description", content: "E-commerce da Padaria Artesanal Dona Margarida: pães de fermentação natural, doces de receita familiar e bebidas artesanais." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/656aeb4d-0ea6-4bc5-b1ef-24cad06cd009/id-preview-84978465--7dd3e226-6b7c-4daf-9bf3-30da8191624a.lovable.app-1781548393363.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/656aeb4d-0ea6-4bc5-b1ef-24cad06cd009/id-preview-84978465--7dd3e226-6b7c-4daf-9bf3-30da8191624a.lovable.app-1781548393363.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bitter:wght@400;600;700&family=Lato:wght@400;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Layout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bare = pathname.startsWith("/admin");
  if (bare) return <Outlet />;
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Layout />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}
