import { create } from "zustand";

/**
 * Factory function to create a reusable CRUD store
 * This is the CORE LOGIC layer (no UI concern, no feature naming)
 */
const createCrudStore = (service) => {
  const { getItems, addItem, updateItem, deleteItem } = service;

  return create((set) => ({
    /**
     * Global list of items (generic)
     */
    items: [],

    /**
     * Track which item is currently loading (useful for delete/update UI state)
     */
    loadingId: null,

    // -----------------------------
    // FETCH ALL ITEMS
    // -----------------------------
    /**
     * Fetch all items from backend and store into state
     */
    fetchItems: async () => {
      const list = await getItems();

      /**
       * sort newest first
       */
      list.sort((a, b) => b.createdAt - a.createdAt);

      set({ items: list });
    },

    // -----------------------------
    // ADD ITEM
    // -----------------------------
    /**
     * Add new item to database and update local state
     */
    add: async (data) => {
      const newItem = {
        ...data,
        createdAt: Date.now(),
      };

      const id = await addItem(newItem);

      /**
       * optimistic-like local update
       */
      set((state) => ({
        items: [{ id, ...newItem }, ...state.items],
      }));

      return id;
    },

    // -----------------------------
    // UPDATE ITEM
    // -----------------------------
    /**
     * Update existing item by id
     */
    update: async (id, data) => {
      await updateItem(id, data);

      /**
       * merge updated fields into existing item
       */
      set((state) => ({
        items: state.items.map((p) => (p.id === id ? { ...p, ...data } : p)),
      }));
    },

    // -----------------------------
    // DELETE ITEM
    // -----------------------------
    /**
     * Delete item by id
     */
    remove: async (id) => {
      /**
       * mark loading for UI feedback
       */
      set({ loadingId: id });

      await deleteItem(id);

      /**
       * remove from local state
       */
      set((state) => ({
        items: state.items.filter((p) => p.id !== id),
        loadingId: null,
      }));
    },
  }));
};

export default createCrudStore;
