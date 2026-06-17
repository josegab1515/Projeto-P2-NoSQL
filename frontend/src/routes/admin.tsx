import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { LogOut, Plus, Wheat, ShoppingBag, Users, Trash2, Pencil } from "lucide-react";
import { formatBRL, type Category } from "@/lib/products";
import { apiService, type APIProduct, type APIProductCreate, type APIFuncionario, type APIFuncionarioCreate } from "../services/api";

const AUTH_KEY = "dq-admin-auth";

// Componentes utilitários mantidos no escopo do arquivo
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
    setAuthed(localStorage.getItem(AUTH_KEY) === "1");
    setReady(true);
  }, []);

  if (!ready) return null;

  return authed ? (
    <Panel onLogout={() => { localStorage.removeItem(AUTH_KEY); setAuthed(false); }} />
  ) : (
    <Login onOk={() => { localStorage.setItem(AUTH_KEY, "1"); setAuthed(true); }} />
  );
}

function Login({ onOk }: { onOk: () => void }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const userVal = String(fd.get("user") || "");
    const passVal = String(fd.get("pass") || "");

    try {
      await apiService.login(userVal, passVal);
      onOk();
    } catch (err: any) {
      setError(err.message || "Erro ao tentar realizar o login.");
    } finally {
      setLoading(false);
    }
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
            <input 
              name="user" 
              placeholder="ex: João"
              required 
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Senha</span>
            <input 
              name="pass" 
              type="password" 
              placeholder="••••••••"
              required 
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </label>
          
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          
          <button 
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Autenticando..." : "Entrar"}
          </button>
        </div>
        <Link to="/" className="mt-6 block text-center text-xs text-slate-500 hover:text-blue-600">← voltar para a loja</Link>
      </form>
    </div>
  );
}

function Panel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"produtos" | "funcionarios">("produtos");
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [funcionarios, setFuncionarios] = useState<APIFuncionario[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de controle para Produtos
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<APIProduct | null>(null);

  // Estados de controle para Funcionários
  const [showNewFunc, setShowNewFunc] = useState(false);
  const [editingFunc, setEditingFunc] = useState<APIFuncionario | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [prodData, funcData] = await Promise.all([
          apiService.listarProdutos(),
          apiService.listarFuncionarios().catch(() => [])
        ]);
        setProducts(prodData);
        setFuncionarios(funcData);
      } catch (err) {
        console.error("Erro ao carregar dados do MongoDB:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const inStock = useMemo(() => products.filter((p) => Number(p.estoque) > 0).length, [products]);

  const handleUpdateStock = async (produto: APIProduct, novoEstoque: number) => {
    try {
      const payload: APIProductCreate = {
        nome: produto.nome,
        preco: produto.preco,
        descricao: produto.descricao,
        categoria: produto.categoria,
        imagem: produto.imagem,
        estoque: String(novoEstoque)
      };
      
      const atualizado = await apiService.atualizarProduto(produto._id, payload);
      setProducts((cur) => cur.map((p) => (p._id === produto._id ? atualizado : p)));
    } catch (err) {
      alert("Erro ao salvar alteração de estoque no banco.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir permanentemente este produto do cardápio?")) return;
    try {
      await apiService.deletarProduto(id);
      setProducts((cur) => cur.filter((p) => p._id !== id));
    } catch (err) {
      alert("Não foi possível excluir o produto. Tente novamente.");
    }
  };

  const handleSaveProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const produtoPayload: APIProductCreate = {
      nome: String(fd.get("name") || ""),
      preco: String(fd.get("price") || "0"),
      descricao: String(fd.get("description") || ""),
      categoria: String(fd.get("category") || "paes") as Category,
      estoque: String(fd.get("stock") || "0"),
      imagem: String(fd.get("image") || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"),
    };

    try {
      if (editingProduct) {
        const atualizado = await apiService.atualizarProduto(editingProduct._id, produtoPayload);
        setProducts((cur) => cur.map((p) => (p._id === editingProduct._id ? atualizado : p)));
        setEditingProduct(null);
      } else {
        await apiService.criarProduto(produtoPayload);
        setShowNewProduct(false);
        navigate({ to: "/cardapio" });
      }
    } catch (err) {
      alert("Não foi possível salvar as alterações do produto.");
    }
  };

  const handleStartEditProduct = (produto: APIProduct) => {
    setShowNewProduct(false);
    setEditingProduct(produto);
  };

  // 🚀 UNIFICADO: Gerencia a criação e a edição de funcionário
  const handleSaveFuncionario = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const funcionarioPayload: APIFuncionarioCreate = {
      usuario: String(fd.get("func_user") || ""),
      senha: String(fd.get("func_password") || ""),
      cargo: String(fd.get("func_role") || "Atendente"),
    };

    try {
      if (editingFunc) {
        const atualizado = await apiService.atualizarFuncionario(editingFunc._id, funcionarioPayload);
        setFuncionarios((cur) => cur.map((f) => (f._id === editingFunc._id ? atualizado : f)));
        setEditingFunc(null);
      } else {
        const criado = await apiService.criarFuncionario(funcionarioPayload);
        setFuncionarios((cur) => [...cur, criado]);
        setShowNewFunc(false);
      }
      e.currentTarget.reset();
    } catch (err) {
      alert("Erro ao salvar dados do funcionário. Verifique os parâmetros da API.");
    }
  };

  const handleStartEditFunc = (func: APIFuncionario) => {
    setShowNewFunc(false);
    setEditingFunc(func);
  };

  const handleDeleteFuncionario = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este acesso do funcionário?")) return;
    try {
      await apiService.deletarFuncionario(id);
      setFuncionarios((cur) => cur.filter((f) => f._id !== id));
    } catch (err) {
      alert("Erro ao remover funcionário.");
    }
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-slate-50 text-slate-500 font-medium">Conectando ao banco de dados da Dom Quixote... 🥖</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-bread min-w-0">
            <Wheat size={20} className="shrink-0" />
            <span className="font-serif font-bold truncate">Painel de Controle · Dom Quixote</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex bg-slate-100 p-1 rounded-lg text-sm">
              <button 
                onClick={() => setActiveTab("produtos")}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition ${activeTab === "produtos" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
              >
                <ShoppingBag size={14} /> Produtos
              </button>
              <button 
                onClick={() => setActiveTab("funcionarios")}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition ${activeTab === "funcionarios" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
              >
                <Users size={14} /> Equipe
              </button>
            </nav>
            <button onClick={onLogout} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {activeTab === "produtos" && (
          <div>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <Stat label="Produtos cadastrados" value={String(products.length)} />
              <Stat label="Em estoque" value={String(inStock)} accent="text-emerald-600" />
              <Stat label="Sem estoque" value={String(products.length - inStock)} accent="text-red-600" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Catálogo de Cardápio</h2>
              <button 
                onClick={() => { setEditingProduct(null); setShowNewProduct((v) => !v); }} 
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800"
              >
                <Plus size={14} /> Novo produto
              </button>
            </div>

            {/* Form de Produtos */}
            {(showNewProduct || editingProduct) && (
              <form onSubmit={handleSaveProduct} className="mb-6 rounded-xl border border-blue-200 bg-blue-50/30 p-5 grid sm:grid-cols-2 gap-3 animate-fade-up">
                <div className="sm:col-span-2 font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  {editingProduct ? `Editando Produto: ${editingProduct.nome}` : "Cadastrar Novo Produto"}
                </div>
                <AField name="name" label="Nome" defaultValue={editingProduct?.nome || ""} required />
                <AField name="price" label="Preço (R$)" type="number" step="0.01" defaultValue={editingProduct?.preco || ""} required />
                <AField name="description" label="Descrição" defaultValue={editingProduct?.descricao || ""} className="sm:col-span-2" />
                <label className="block">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Categoria</span>
                  <select name="category" defaultValue={editingProduct?.categoria || "paes"} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white h-[38px]">
                    <option value="paes">Pães</option>
                    <option value="doces">Doces</option>
                    <option value="bebidas">Bebidas</option>
                  </select>
                </label>
                <AField name="stock" label="Quantidade em estoque" type="number" defaultValue={editingProduct?.estoque || "10"} />
                <AField name="image" label="URL da foto" defaultValue={editingProduct?.imagem || ""} className="sm:col-span-2" />
                <div className="sm:col-span-2 flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => { setShowNewProduct(false); setEditingProduct(null); }} 
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm"
                  >
                    Cancelar
                  </button>
                  <button className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700">
                    {editingProduct ? "Salvar Alterações" : "Adicionar e ir para o Cardápio"}
                  </button>
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
                    <th className="px-4 py-3 font-semibold text-slate-600 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={p.imagem} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate">{p.nome}</div>
                            <div className="text-xs text-slate-500 truncate max-w-[28ch]">{p.descricao}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize text-slate-600">{p.categoria}</td>
                      <td className="px-4 py-3 font-semibold">{formatBRL(Number(p.preco))}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={p.estoque}
                          onChange={(e) => handleUpdateStock(p, Math.max(0, Number(e.target.value)))}
                          className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {Number(p.estoque) > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Em estoque
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Sem estoque
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => handleStartEditProduct(p)}
                            className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center"
                            title="Editar Produto"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p._id)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center"
                            title="Excluir Produto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "funcionarios" && (
          <div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Stat label="Usuários com Acesso" value={String(funcionarios.length)} />
              <Stat label="Nível Admin" value={String(funcionarios.filter(f => f.cargo === "Admin" || f.cargo === "Gerente").length)} accent="text-amber-600" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Credenciais da Equipe (MongoDB)</h2>
              <button 
                onClick={() => { setEditingFunc(null); setShowNewFunc((v) => !v); }} 
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800"
              >
                <Plus size={14} /> Novo Acesso / Funcionário
              </button>
            </div>

            {/* Form Dinâmico de Funcionários (Criação ou Edição) */}
            {(showNewFunc || editingFunc) && (
              <form onSubmit={handleSaveFuncionario} className="mb-6 rounded-xl border border-amber-200 bg-amber-50/20 p-5 grid sm:grid-cols-3 gap-3 animate-fade-up">
                <div className="sm:col-span-3 font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  {editingFunc ? `Editando Acesso de: ${editingFunc.usuario}` : "Cadastrar Novo Funcionário"}
                </div>
                <AField name="func_user" label="Usuário (Login)" defaultValue={editingFunc?.usuario || ""} placeholder="ex: joao.silva" required />
                <AField name="func_password" label={editingFunc ? "Nova Senha (ou repita)" : "Senha Inicial"} type="password" required />
                <label className="block">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Cargo / Nível</span>
                  <select name="func_role" defaultValue={editingFunc?.cargo || "Atendente"} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white h-[38px]">
                    <option value="Padeiro">Padeiro</option>
                    <option value="Confeiteiro">Confeiteiro</option>
                    <option value="Atendente">Atendente / Caixa</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Admin">Administrador</option>
                  </select>
                </label>
                <div className="sm:col-span-3 flex justify-end gap-2 mt-2">
                  <button 
                    type="button" 
                    onClick={() => { setShowNewFunc(false); setEditingFunc(null); }} 
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm"
                  >
                    Cancelar
                  </button>
                  <button className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-sm font-semibold">
                    {editingFunc ? "Salvar Alterações" : "Criar Usuário"}
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-600">ID no MongoDB</th>
                    <th className="px-6 py-3 font-semibold text-slate-600">Usuário de Sistema</th>
                    <th className="px-6 py-3 font-semibold text-slate-600">Cargo</th>
                    <th className="px-6 py-3 font-semibold text-slate-600 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {funcionarios.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400">Nenhum usuário ou funcionário cadastrado no banco ainda.</td>
                    </tr>
                  ) : (
                    funcionarios.map((f) => (
                      <tr key={f._id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 font-mono text-xs text-slate-400">{f._id}</td>
                        <td className="px-6 py-3 font-semibold text-slate-900">{f.usuario}</td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/10">
                            {f.cargo}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* 🚀 NOVO: Botão para editar dados do funcionário */}
                            <button 
                              onClick={() => handleStartEditFunc(f)}
                              className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center"
                              title="Editar Funcionário"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteFuncionario(f._id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center"
                              title="Deletar Usuário"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}