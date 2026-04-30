// Global product state management
import { create } from "zustand";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/features/product/services/product.service.js";

import useCrudStore from "@/store/crud.store.js";

// set is a function tell Zustand to update state
export const useProductStore = create((set, get) => ({
  products: [],
  loadingId: null,

  // Fetch all products
  fetchProducts: async () => {
    const crud = useCrudStore.getState();
    await crud.fetchItems();
    set({
      products: crud.items,
    });
  },

  // Add product
  add: async (data) => {
    const crud = useCrudStore.getState();
    const newItem = await crud.add(data);
    set((state) => ({
      products: [newItem, ...state.products],
    }));
    return newItem.id;
  },

  // Update product
  update: async (id, data) => {
    const crud = useCrudStore.getState();
    await crud.update(id, data);
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...data } : p,
      ),
    }));
  },

  // Delete product
  remove: async (id) => {
    const crud = useCrudStore.getState();
    set({ loadingId: id });
    await crud.remove(id);

    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      loadingId: null,
    }));
  },
}));
