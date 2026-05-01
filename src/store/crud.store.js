import { create } from "zustand";

// Factory function to create a reusable CRUD store
// This is the CORE LOGIC layer (no UI concern, no feature naming)
const createCrudStore = (service) => {
  const { getItems, addItem, updateItem, deleteItem } = service;

  return create((set) => ({
    // Global list of items (generic)
    items: [],

    // Track which item is currently loading (useful for delete/update UI state)
    loadingId: null,

    // -----------------------------
    // FETCH ALL ITEMS
    // -----------------------------
    fetchItems: async () => {
      console.log("🔥 crud.store: fetchItems");

      const list = await getItems();

      // sort newest first
      list.sort((a, b) => b.createdAt - a.createdAt);

      set({ items: list });
    },

    // -----------------------------
    // ADD ITEM
    // -----------------------------
    add: async (data) => {
      console.log("🔥 crud.store: add");

      const newItem = {
        ...data,
        createdAt: Date.now(), // attach timestamp
      };

      const id = await addItem(newItem);

      // optimistic-like local update
      set((state) => ({
        items: [{ id, ...newItem }, ...state.items],
      }));

      return id;
    },

    // -----------------------------
    // UPDATE ITEM
    // -----------------------------
    update: async (id, data) => {
      console.log("🔥 crud.store: update");

      await updateItem(id, data);

      // merge updated fields into existing item
      set((state) => ({
        items: state.items.map((p) => (p.id === id ? { ...p, ...data } : p)),
      }));
    },

    // -----------------------------
    // DELETE ITEM
    // -----------------------------
    remove: async (id) => {
      console.log("🔥 crud.store: remove");

      // mark loading for UI feedback
      set({ loadingId: id });

      await deleteItem(id);

      // remove from local state
      set((state) => ({
        items: state.items.filter((p) => p.id !== id),
        loadingId: null,
      }));
    },
  }));
};

export default createCrudStore;
