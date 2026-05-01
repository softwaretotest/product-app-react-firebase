import { create } from "zustand";

/**
 * UI Adapter Layer for Zustand CRUD Stores
 *
 * This wrapper store sits on top of a base CRUD store and transforms
 * generic state (items) into UI-friendly state (e.g. products, customers, orders).
 *
 * WHY THIS EXISTS:
 * - baseStore handles pure business logic (CRUD)
 * - wrapperStore adapts data for UI consumption
 * - allows renaming, reshaping, and UI-level state control
 *
 * RESULT:
 * UI components can use meaningful state names instead of generic "items"
 * (e.g. productStore.products instead of productStore.items)
 */
const createWrapperStore = (baseStore, key = "items") => {
  return create((set) => ({
    /**
     * UI-friendly renamed state derived from baseStore.items
     */
    [key]: [],

    /**
     * UI-level loading state (mapped from baseStore)
     */
    loadingId: null,

    // --------------------------------------------
    // SYNC STATE FROM BASE STORE
    // --------------------------------------------
    /**
     * Syncs state from baseStore into wrapperStore
     *
     * Used when you want to manually refresh UI state
     * from the underlying CRUD store.
     */
    sync: () => {
      console.log("🟡 wrapper: sync");

      const { items, loadingId } = baseStore.getState();

      set({
        [key]: items || [],
        loadingId,
      });
    },

    // --------------------------------------------
    // FETCH WRAPPER API
    // --------------------------------------------
    /**
     * Fetch items via baseStore and update UI state
     */
    fetch: async () => {
      console.log("🟡 wrapper: fetch");

      await baseStore.getState().fetchItems();

      set({
        [key]: baseStore.getState().items,
        loadingId: baseStore.getState().loadingId,
      });
    },

    // --------------------------------------------
    // ADD WRAPPER API
    // --------------------------------------------
    /**
     * Add new item via baseStore and sync UI state
     */
    add: async (data) => {
      console.log("🟡 wrapper: add");

      const id = await baseStore.getState().add(data);

      set({
        [key]: baseStore.getState().items,
      });

      return id;
    },

    // --------------------------------------------
    // UPDATE WRAPPER API
    // --------------------------------------------
    /**
     * Update existing item via baseStore and sync UI state
     */
    update: async (id, data) => {
      console.log("🟡 wrapper: update");

      await baseStore.getState().update(id, data);

      set({
        [key]: baseStore.getState().items,
      });
    },

    // --------------------------------------------
    // REMOVE WRAPPER API
    // --------------------------------------------
    /**
     * Remove item via baseStore and sync UI state
     */
    remove: async (id) => {
      console.log("🟡 wrapper: remove");

      await baseStore.getState().remove(id);

      set({
        [key]: baseStore.getState().items,
        loadingId: baseStore.getState().loadingId,
      });
    },
  }));
};

export default createWrapperStore;
