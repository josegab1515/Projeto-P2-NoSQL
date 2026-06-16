export type Category = "paes" | "doces" | "bebidas";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
}

export const CATEGORIES: { id: Category | "todos"; label: string; emoji: string }[] = [
  { id: "todos", label: "Todos", emoji: "🌾" },
  { id: "paes", label: "Pães", emoji: "🍞" },
  { id: "doces", label: "Doces", emoji: "🧁" },
  { id: "bebidas", label: "Bebidas", emoji: "☕" },
];

export const PRODUCTS: Product[] = [
  {
    id: "sourdough",
    name: "Sourdough Rústico (800g)",
    description: "Pão de fermentação natural, casca crocante e miolo aerado.",
    price: 17.0,
    category: "paes",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    stock: 12,
  },
  {
    id: "pao-milho",
    name: "Pão de Milho Caipira",
    description: "Receita tradicional, fofinho.",
    price: 10.5,
    category: "paes",
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80",
    stock: 8,
  },
  {
    id: "baguete",
    name: "Baguete Francesa",
    description: "Crosta dourada e miolo macio.",
    price: 9.9,
    category: "paes",
    image: "https://images.unsplash.com/photo-1568471173242-461f0a730452?auto=format&fit=crop&w=800&q=80",
    stock: 20,
  },
  {
    id: "pao",
    name: "Pão Integral",
    description: "Pão integral com grãos.",
    price: 12.0,
    category: "paes",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
    stock: 10,
  },
  {
    id: "bolo-dia",
    name: "Bolo do Dia (fatia)",
    description: "Hoje: bolo de chocolate em camadas.",
    price: 15.0,
    category: "doces",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    stock: 15,
  },
  {
    id: "rosquinhas",
    name: "Rosquinhas",
    description: "Super macias e com várias coberturas.",
    price: 10.5,
    category: "doces",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
    stock: 25,
  },
  {
    id: "cookies",
    name: "Cookie de chocolate",
    description: "Massa amanteigada, gotas de chocolate.",
    price: 8.0,
    category: "doces",
    image: "https://images.unsplash.com/photo-1464195244916-405fa0a82545?auto=format&fit=crop&w=800&q=80",
    stock: 6,
  },
  {
    id: "croissant",
    name: "Croissant de Manteiga",
    description: "Folhado em três dias.",
    price: 9.5,
    category: "doces",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    stock: 18,
  },
  {
    id: "cafe-coado",
    name: "Café Coado Especial",
    description: "Grãos especiais e selecionados, coado na hora.",
    price: 7.0,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    stock: 50,
  },
  {
    id: "suco-laranja",
    name: "Suco de Laranja Natural",
    description: "Espremido na hora, 400ml.",
    price: 9.5,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    stock: 30,
  },
  {
    id: "bubble-tea",
    name: "Bubble Tea",
    description: "Gelado, doce e resfrescante ao mesmo tempo.",
    price: 14.0,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1525803377221-4f6ccdaa5133?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    stock: 22,
  },
  {
    id: "chocolate-quente",
    name: "Chocolate Quente Cremoso",
    description: "70% cacau, leite integral e raspas de chocolate.",
    price: 12.5,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
    stock: 0,
  },
];

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
