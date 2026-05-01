// crud.store.js

import { create } from "zustand";
const createCrudStore = (service) => {
  const { getItems, addItem, updateItem, deleteItem } = service;

  return create((set) => ({
    items: [],
    loadingId: null, //tell UI which item is gonna be used
    fetchItems: async () => {
      console.log("called from CRUD.STORE - FETCHITEM()");
      console.log("🔥 crud.store: fetchItems");
      const list = await getItems();
      list.sort((a, b) => b.createdAt - a.createdAt);
      set({ items: list });
    },

    add: async (data) => {
      console.log("🔥 crud.store: add");
      const newItem = { ...data, createdAt: Date.now() };
      const id = await addItem(newItem);
      set((state) => ({
        items: [{ id, ...newItem }, ...state.items],
      }));
      return id;
    },

    update: async (id, data) => {
      console.log("🔥 crud.store: update");
      await updateItem(id, data);
      set((state) => ({
        items: state.items.map((p) => (p.id === id ? { ...p, ...data } : p)),
      }));
    },

    remove: async (id) => {
      console.log("🔥 crud.store: remove");
      set({ loadingId: id });
      await deleteItem(id);
      set((state) => ({
        items: state.items.filter((p) => p.id !== id),
        loadingId: null,
      }));
    },
  }));
};

export default createCrudStore;
