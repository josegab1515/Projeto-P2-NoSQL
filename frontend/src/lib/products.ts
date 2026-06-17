// src/lib/products.ts

// 1. O formato exato que vem do seu MongoDB/FastAPI
export interface APIProduct {
  _id: string;
  nome: string;
  preco: string; // Vem como string da API
  descricao: string;
  categoria: string;
  estoque: string; // Vem como string da API
  imagem: string;
}

// Tipo utilitário para quando você for criar um produto no painel administrativo
export type APIProductCreate = Omit<APIProduct, '_id'>;

// 2. O formato que seus componentes visuais (como o ProductCard) usam
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "paes" | "doces" | "bebidas";
  stock: number;
  image: string;
}

// 3. Função transformadora (Mapeador)
export function mapAPIProductToProduct(apiProd: APIProduct): Product {
  // Garante que o mapeamento de string para as chaves exatas de categoria funcione
  const categoryMap: Record<string, Product['category']> = {
    'paes': 'paes',
    'doces': 'doces',
    'bebidas': 'bebidas'
  };

  return {
    id: apiProd._id,
    name: apiProd.nome,
    price: parseFloat(apiProd.preco) || 0,
    description: apiProd.descricao,
    category: categoryMap[apiProd.categoria] || 'paes', // Fallback caso venha algo diferente
    stock: parseInt(apiProd.estoque, 10) || 0,
    image: apiProd.imagem,
  };
}

// 4. Estrutura de Categorias para os seus botões de filtro
export type Category = Product['category'];

export interface CategoryItem {
  id: Category | 'todos';
  label: string;
  emoji: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: "todos", label: "Todos", emoji: "✨" },
  { id: "paes", label: "Pães", emoji: "🥖" },
  { id: "doces", label: "Doces", emoji: "🥐" },
  { id: "bebidas", label: "Bebidas", emoji: "☕" },
];

// 5. Função utilitária para formatar o preço em Real (R$)
export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}