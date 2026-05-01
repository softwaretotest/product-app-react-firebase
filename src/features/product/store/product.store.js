import { create } from "zustand";
import createCrudStore from "@/store/crud.store";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service";

// base store (generic)
const useProductBaseStore = createCrudStore({
  getItems: getProducts,
  addItem: addProduct,
  updateItem: updateProduct,
  deleteItem: deleteProduct,
});

// wrapper store (domain-specific)
const useProductStore = create((set) => ({
  products: [], // ✅ กัน undefined
  loadingId: null,

  fetchProducts: async () => {
    console.log("🟢 product.store: fetchProducts");
    await useProductBaseStore.getState().fetchItems();
    const { items, loadingId } = useProductBaseStore.getState();
    set({
      products: items || [],
      loadingId,
    });
  },

  add: async (data) => {
    console.log("🟢 product.store: add");
    const id = await useProductBaseStore.getState().add(data);
    const { items } = useProductBaseStore.getState();
    set({ products: items });
    return id;
  },

  update: async (id, data) => {
    console.log("🟢 product.store: update");
    await useProductBaseStore.getState().update(id, data);
    const { items } = useProductBaseStore.getState();
    set({ products: items });
  },

  remove: async (id) => {
    console.log("🟢 product.store: remove");
    await useProductBaseStore.getState().remove(id);
    const { items, loadingId } = useProductBaseStore.getState();
    set({
      products: items,
      loadingId,
    });
  },
}));

export default useProductStore;
