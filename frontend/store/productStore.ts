import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: string;
  title: string;
  price: number;
  imageUri?: string;
  location?: string;
  description?: string;
  condition?: string;
  notes?: string;
  category?: string;
  rating?: string;
}

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  clearProducts: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),
      clearProducts: () => set({ products: [] }),
    }),
    { name: "product-storage" }
  )
);
