// Global product state management
import { create } from "zustand";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/features/product/services/product.service.js";

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
  // doc.data() contains all field in a product
  // add createAt to data
  add: async (data) => {
    const newItem = { ...data, createdAt: Date.now() };
    const id = await addProduct(newItem);
    // make new array of products
    // state is the current value of store , e.g.
    //     state = {
    //   products: [
    //     { id: "1", name: "A" },
    //     { id: "2", name: "B" }
    //   ]
    // }
    set((state) => ({
      products: [{ id, ...newItem }, ...state.products], // state.products = old product list
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
