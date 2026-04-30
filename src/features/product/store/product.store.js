import { create } from "zustand";
import useCrudStore from "@/store/crud.store.js";

export const useProductStore = create(() => ({
  get products() {
    return useCrudStore.getState().items;
  },

  get loadingId() {
    return useCrudStore.getState().loadingId;
  },

  fetchProducts: async () => {
    return useCrudStore.getState().fetchItems();
  },

  add: async (data) => {
    return useCrudStore.getState().add(data);
  },

  update: async (id, data) => {
    return useCrudStore.getState().update(id, data);
  },

  remove: async (id) => {
    return useCrudStore.getState().remove(id);
  },
}));
