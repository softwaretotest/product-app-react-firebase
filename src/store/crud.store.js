// Global product state management
import { create } from "zustand";
function useCrudStore(getItems, addItem, updateItem, deleteItem) {
  // set is a function tell Zustand to update state
  const useItemStore = create((set) => ({
    items: [],
    loadingId: null,

    // Fetch all items
    fetchItems: async () => {
      const list = await getItems();
      list.sort((a, b) => b.createdAt - a.createdAt); // latest first
      set({ items: list });
    },

    // Add product
    // doc.data() contains all field in a product
    // add createAt to data
    add: async (data) => {
      const newItem = { ...data, createdAt: Date.now() };
      const id = await addItem(newItem);
      // make new array of items
      // state is the current value of store , e.g.
      //     state = {
      //   items: [
      //     { id: "1", name: "A" },
      //     { id: "2", name: "B" }
      //   ]
      // }
      set((state) => ({
        items: [{ id, ...newItem }, ...state.items], // state.items = old product list
      }));

      return id;
    },

    // Update product
    update: async (id, data) => {
      await updateItem(id, data);
      set((state) => ({
        items: state.items.map((p) => (p.id === id ? { ...p, ...data } : p)),
      }));
    },

    // Delete product
    remove: async (id) => {
      set({ loadingId: id });
      await deleteItem(id);

      set((state) => ({
        items: state.items.filter((p) => p.id !== id),
        loadingId: null,
      }));
    },
  }));
}
export default useCrudStore;
