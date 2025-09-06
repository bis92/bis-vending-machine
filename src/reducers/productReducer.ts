import type { Product } from '../types/product';

export type ProductAction =
  | { type: 'DISPENSE'; id: string }
  | { type: 'RESTOCK'; id: string; amount: number }
  | { type: 'RESET'; initial: Product[] };

export function productsReducer(state: Product[], action: ProductAction): Product[] {
  switch (action.type) {
    case 'DISPENSE':
      return state.map((p) => (p.id === action.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p));
    case 'RESTOCK':
      return state.map((p) => (p.id === action.id ? { ...p, stock: p.stock + action.amount } : p));
    case 'RESET':
      return action.initial;
    default:
      return state;
  }
}
