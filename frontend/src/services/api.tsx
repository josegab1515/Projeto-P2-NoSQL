// src/services/api.ts
import { APIProduct, APIProductCreate } from '../lib/products';
export { type APIProduct, type APIProductCreate } from '../lib/products';

const API_BASE_URL = 'http://localhost:8000'; // URL da sua API FastAPI

export interface APIItemPedido {
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
}

// Mapeia o payload de criação do Pedido
export interface APIPedidocreate {
  cliente_id: string;
  itens: APIItemPedido[];
  total: number;
  pagamento: string;
  status: string;
}

export interface APIClienteCreate {
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  bairro: string;
  complemento: string;
}

export interface APIFuncionarioCreate {
  usuario: string;
  senha: string;
  cargo: string;
}

export interface APIFuncionario extends APIFuncionarioCreate {
  _id: string;
}

export const apiService = {
  // 1. Listar todos os produtos (GET /produtos/)
  async listarProdutos(): Promise<APIProduct[]> {
    const response = await fetch(`${API_BASE_URL}/produtos/`);
    if (!response.ok) throw new Error('Erro ao buscar produtos');
    return response.json();
  },

  // 2. Buscar um produto específico (GET /produtos/{id})
  async buscarProduto(id: string): Promise<APIProduct> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`);
    if (!response.ok) throw new Error('Produto não encontrado');
    return response.json();
  },

  // 3. Criar um novo produto (POST /produtos/)
  async criarProduto(produto: APIProductCreate): Promise<APIProduct> {
    const response = await fetch(`${API_BASE_URL}/produtos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto),
    });
    if (!response.ok) throw new Error('Erro ao criar produto');
    return response.json();
  },

  async atualizarProduto(id: string, produto: APIProductCreate): Promise<APIProduct> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto),
    });
    if (!response.ok) throw new Error('Erro ao atualizar produto');
    return response.json();
  },

  // 4. Deletar um produto (DELETE /produtos/{id})
  async deletarProduto(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar produto');
  },

  // 5. Cadastrar Cliente no MongoDB (POST /clientes/)
  async criarCliente(cliente: APIClienteCreate): Promise<{ _id: string }> {
    const response = await fetch(`${API_BASE_URL}/clientes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    });
    if (!response.ok) throw new Error('Erro ao registrar cliente');
    return response.json();
  },

  // 6. Cadastrar Pedido no MongoDB (POST /pedidos/)
  async criarPedido(pedido: APIPedidocreate | any): Promise<{ _id: string }> {
    const response = await fetch(`${API_BASE_URL}/pedidos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    });
    if (!response.ok) throw new Error('Erro ao registrar pedido');
    return response.json();
  },

  async listarFuncionarios(): Promise<APIFuncionario[]> {
    const response = await fetch(`${API_BASE_URL}/funcionarios/`);
    if (!response.ok) throw new Error('Erro ao buscar funcionários');
    return response.json();
  },

  async atualizarFuncionario(id: string, funcionario: APIFuncionarioCreate): Promise<APIFuncionario> {
    const response = await fetch(`${API_BASE_URL}/funcionarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(funcionario),
    });
    if (!response.ok) throw new Error('Erro ao atualizar funcionário');
    return response.json();
  },

  // 2. Criar Funcionário (POST /funcionarios/)
  async criarFuncionario(funcionario: APIFuncionarioCreate): Promise<APIFuncionario> {
    const response = await fetch(`${API_BASE_URL}/funcionarios/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(funcionario),
    });
    if (!response.ok) throw new Error('Erro ao cadastrar funcionário');
    return response.json();
  },

  // 3. Deletar Funcionário (DELETE /funcionarios/{funcionario_id})
  async deletarFuncionario(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/funcionarios/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao remover funcionário');
  }, // 🚀 A VÍRGULA QUE FALTAVA FOI ADICIONADA AQUI!
  
  // 4. Autenticação simples (POST /auth/login)
  async login(usuario: string, senha: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Erro ao fazer login");
    }

    return response.json();
  },
  async atualizarFuncionario(id: string, funcionario: APIFuncionarioCreate): Promise<APIFuncionario> {
    const response = await fetch(`${API_BASE_URL}/funcionarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(funcionario),
    });
    if (!response.ok) throw new Error('Erro ao atualizar funcionário');
    return response.json();
  }
};