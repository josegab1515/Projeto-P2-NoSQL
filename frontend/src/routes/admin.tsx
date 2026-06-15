import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { LogOut, Plus, Wheat, Save } from "lucide-react";
import { PRODUCTS, formatBRL, type Product, type Category } from "@/lib/products";

const KEY = "dq-admin-auth";
const STOCK_KEY = "dq-admin-stock";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Gestão · Padaria Dom Quixote" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setAuthed(localStorage.getItem(KEY) === "1");
    setReady(true);
  }, []);
  if (!ready) return null;
  return authed ? <Panel onLogout={() => { localStorage.removeItem(KEY); setAuthed(false); }} /> : <Login onOk={() => { localStorage.setItem(KEY, "1"); setAuthed(true); }} />;
}

function Login({ onOk }: { onOk: () => void }) {
  const [error, setError] = useState("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("user") === "admin" && fd.get("pass") === "padaria123") onOk();
    else setError("Usuário ou senha incorretos");
  };
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="flex items-center gap-2 text-bread">
          <Wheat size={22} /> <span className="font-serif text-xl font-bold">Portal de Funcionários</span>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Entrar</h1>
        <p className="text-sm text-slate-500 mt-1">Acesso restrito · Dom Quixote</p>
        <div className="mt-6 space-y-3">
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Usuário</span>
            <input name="user" defaultValue="admin" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Senha</span>
            <input name="pass" type="password" defaultValue="padaria123" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="w-full rounded-lg bg-blue-600 text-white py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-blue-700">Entrar</button>
        </div>
        <p className="mt-4 text-[11px] text-slate-400 text-center">demo: admin / padaria123</p>
        <Link to="/" className="mt-6 block text-center text-xs text-slate-500 hover:text-blue-600">← voltar para a loja</Link>
      </form>
    </div>
  );
}

interface AdminProduct extends Product {}

function Panel({ onLogout }: { onLogout: () => void }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [dirty, setDirty] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    try {
      const overrides = JSON.parse(localStorage.getItem(STOCK_KEY) || "{}");
      const merged = PRODUCTS.map((p) => (overrides[p.id] != null ? { ...p, stock: overrides[p.id] } : p));
      setProducts(merged);
    } catch {
      setProducts(PRODUCTS);
    }
  }, []);

  const inStock = useMemo(() => products.filter((p) => p.stock > 0).length, [products]);

  const updateStock = (id: string, stock: number) => {
    setProducts((cur) => cur.map((p) => (p.id === id ? { ...p, stock } : p)));
    setDirty(true);
  };

  const save = () => {
    const overrides: Record<string, number> = {};
    products.forEach((p) => (overrides[p.id] = p.stock));
    localStorage.setItem(STOCK_KEY, JSON.stringify(overrides));
    setDirty(false);
  };

  const addNew = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newP: AdminProduct = {
      id: `new-${Date.now()}`,
      name: String(fd.get("name") || ""),
      description: String(fd.get("description") || ""),
      price: Number(fd.get("price") || 0),
      category: String(fd.get("category") || "paes") as Category,
      stock: Number(fd.get("stock") || 0),
      image: String(fd.get("image") || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"),
    };
    setProducts((cur) => [newP, ...cur]);
    setDirty(true);
    setShowNew(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-bread min-w-0">
            <Wheat size={20} className="shrink-0" />
            <span className="font-serif font-bold truncate">Gestão de Produtos · Dom Quixote</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-slate-500 hover:text-blue-600 hidden sm:inline">Ver loja</Link>
            <button onClick={onLogout} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Stat label="Produtos cadastrados" value={String(products.length)} />
          <Stat label="Em estoque" value={String(inStock)} accent="text-emerald-600" />
          <Stat label="Sem estoque" value={String(products.length - inStock)} accent="text-red-600" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Catálogo</h2>
          <div className="flex gap-2">
            <button onClick={() => setShowNew((v) => !v)} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800">
              <Plus size={14} /> Novo produto
            </button>
            <button
              onClick={save}
              disabled={!dirty}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={14} /> Salvar alterações
            </button>
          </div>
        </div>

        {showNew && (
          <form onSubmit={addNew} className="mb-6 rounded-xl border border-slate-200 bg-white p-5 grid sm:grid-cols-2 gap-3 animate-fade-up">
            <AField name="name" label="Nome" required />
            <AField name="price" label="Preço (R$)" type="number" step="0.01" required />
            <AField name="description" label="Descrição" className="sm:col-span-2" />
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Categoria</span>
              <select name="category" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="paes">Pães</option>
                <option value="doces">Doces</option>
                <option value="bebidas">Bebidas</option>
              </select>
            </label>
            <AField name="stock" label="Quantidade em estoque" type="number" defaultValue="10" />
            <AField name="image" label="URL da foto" className="sm:col-span-2" />
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowNew(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancelar</button>
              <button className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-semibold">Adicionar</button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Produto</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Categoria</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Preço</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Estoque</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{p.name}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[28ch]">{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">{p.category}</td>
                  <td className="px-4 py-3 font-semibold">{formatBRL(p.price)}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={p.stock}
                      onChange={(e) => updateStock(p.id, Math.max(0, Number(e.target.value)))}
                      className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {p.stock > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Em estoque
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Sem estoque
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 text-3xl font-bold ${accent || "text-slate-900"}`}>{value}</div>
    </div>
  );
}

function AField({ label, className = "", ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</span>
      <input {...props} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </label>
  );
}
