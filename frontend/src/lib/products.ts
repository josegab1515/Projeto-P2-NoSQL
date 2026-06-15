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
    description: "Pão de fermentação natural, casca crocante e miolo aerado. 36h de fermentação.",
    price: 18.9,
    category: "paes",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    stock: 12,
  },
  {
    id: "pao-milho",
    name: "Pão de Milho Caipira",
    description: "Receita da vó, com fubá amarelo e erva-doce.",
    price: 14.5,
    category: "paes",
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80",
    stock: 8,
  },
  {
    id: "baguete",
    name: "Baguete Francesa",
    description: "Crosta dourada e miolo macio, assada no forno a lenha.",
    price: 9.9,
    category: "paes",
    image: "https://images.unsplash.com/photo-1568471173242-461f0a730452?auto=format&fit=crop&w=800&q=80",
    stock: 20,
  },
  {
    id: "ciabatta",
    name: "Ciabatta de Azeite",
    description: "Pão italiano com azeite extra-virgem e flor de sal.",
    price: 12.0,
    category: "paes",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
    stock: 10,
  },
  {
    id: "bolo-dia",
    name: "Bolo do Dia (fatia)",
    description: "Hoje: bolo de laranja com calda cítrica.",
    price: 11.0,
    category: "doces",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80",
    stock: 15,
  },
  {
    id: "rosquinhas",
    name: "Rosquinhas de Polvilho",
    description: "Crocantes por fora, leves por dentro. Pacote com 12 unidades.",
    price: 16.5,
    category: "doces",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
    stock: 25,
  },
  {
    id: "torta-limao",
    name: "Torta de Limão Siciliano",
    description: "Massa amanteigada, creme de limão e merengue maçaricado.",
    price: 22.0,
    category: "doces",
    image: "https://images.unsplash.com/photo-1464195244916-405fa0a82545?auto=format&fit=crop&w=800&q=80",
    stock: 6,
  },
  {
    id: "croissant",
    name: "Croissant de Manteiga",
    description: "Folhado em três dias, com manteiga francesa.",
    price: 8.5,
    category: "doces",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    stock: 18,
  },
  {
    id: "cafe-coado",
    name: "Café Coado Especial",
    description: "Grãos do sul de Minas, torra média, coado na hora.",
    price: 7.0,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
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
    id: "kombucha",
    name: "Kombucha de Gengibre",
    description: "Fermentado artesanal, refrescante e probiótico.",
    price: 14.0,
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1595981234058-a9302fb97229?auto=format&fit=crop&w=800&q=80",
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
