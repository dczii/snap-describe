import { create } from "zustand";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUri?: string;
  location?: string;
  description?: string;
}

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
}));
