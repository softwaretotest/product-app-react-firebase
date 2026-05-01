import { create } from "zustand";

const createWrapperStore = (baseStore, key = "items") => {
  return create((set) => ({
    // --------------------------------------------
    // 1. RENAMED STATE (UI-FRIENDLY STATE KEY)
    // --------------------------------------------
    // Instead of exposing "items", we rename it to something
    // meaningful for each feature (e.g. products, customers, orders)
    //
    // This makes the store readable at UI level:
    // productStore.products instead of productStore.items
    [key]: [],

    // --------------------------------------------
    // UI-LEVEL LOADING STATE
    // --------------------------------------------
    // This is separate from baseStore to allow UI-specific control
    loadingId: null,

    // --------------------------------------------
    // 2. SYNC STATE FROM BASE STORE
    // --------------------------------------------
    // Pulls data from the base CRUD store and pushes it into
    // this wrapper store.
    //
    // WHY THIS EXISTS:
    // - baseStore is generic and not UI-aware
    // - wrapper store is UI-facing and may rename or reshape data
    //
    // Flow:
    // baseStore.getState().items → wrapper state[key]
    sync: () => {
      console.log("🟡 wrapper: sync");

      const { items, loadingId } = baseStore.getState();

      set({
        [key]: items || [],
        loadingId,
      });
    },

    // --------------------------------------------
    // 3. FETCH (UI-FRIENDLY API WRAPPER)
    // --------------------------------------------
    // Calls baseStore.fetchItems() and then syncs state
    //
    // WHY NOT CALL SERVICE DIRECTLY HERE:
    // - keeps all business logic inside crud.store
    // - wrapper only adapts state for UI
    fetch: async () => {
      console.log("🟡 wrapper: fetch");

      await baseStore.getState().fetchItems();

      set({
        [key]: baseStore.getState().items,
        loadingId: baseStore.getState().loadingId,
      });
    },

    // --------------------------------------------
    // ADD (UI-FRIENDLY WRAPPER API)
    // --------------------------------------------
    // Simplifies baseStore.add() for UI usage
    // and automatically updates wrapper state
    add: async (data) => {
      console.log("🟡 wrapper: add");

      const id = await baseStore.getState().add(data);

      set({
        [key]: baseStore.getState().items,
      });

      return id;
    },

    // --------------------------------------------
    // UPDATE (UI-FRIENDLY WRAPPER API)
    // --------------------------------------------
    // Delegates update to baseStore and syncs result
    update: async (id, data) => {
      console.log("🟡 wrapper: update");

      await baseStore.getState().update(id, data);

      set({
        [key]: baseStore.getState().items,
      });
    },

    // --------------------------------------------
    // REMOVE (UI-FRIENDLY WRAPPER API)
    // --------------------------------------------
    // Handles deletion and ensures UI state stays in sync
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
