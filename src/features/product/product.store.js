// Global product state management
import { create } from "zustand";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./product.service";

// set is a function tell Zustand to update state
export const useProductStore = create((set) => ({
  products: [],
  loadingId: null,

  // Fetch all products
  fetchProducts: async () => {
    const list = await getProducts();
    list.sort((a, b) => b.createdAt - a.createdAt); // latest first
    set({ products: list });
  },

  // Add product
  add: async (data) => {
    const newItem = { ...data, createdAt: Date.now() };
    const id = await addProduct(newItem);

    set((state) => ({
      products: [{ id, ...newItem }, ...state.products],
    }));

    return id;
  },

  // Update product
  update: async (id, data) => {
    await updateProduct(id, data);

    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...data } : p,
      ),
    }));
  },

  // Delete product
  remove: async (id) => {
    set({ loadingId: id });
    await deleteProduct(id);

    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      loadingId: null,
    }));
  },
}));
