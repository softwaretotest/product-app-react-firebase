import useProductStore from "@/features/product/product.store.js";

/**
 * Product Controller
 * -------------------
 * This layer sits between UI and Store.
 *
 * It is responsible for:
 * 1. Orchestrating business logic (CRUD flow)
 * 2. Handling UI-related side effects coordination
 * 3. Keeping React components clean and simple
 */
export const productController = () => {
  const store = useProductStore.getState();

  /**
   * 1. CRUD Orchestration
   * ----------------------
   * This function coordinates the "add product" flow.
   * It delegates data persistence to the store,
   * and returns useful metadata for the UI (like new ID).
   */
  const addProduct = async (data) => {
    const id = await store.add(data);

    return {
      id,
      action: "add",
    };
  };

  /**
   * 1. CRUD Orchestration
   * ----------------------
   * Handles update flow.
   * Keeps store logic isolated from UI layer.
   */
  const updateProduct = async (id, data) => {
    await store.update(id, data);

    return {
      id,
      action: "edit",
    };
  };

  /**
   * 1. CRUD Orchestration
   * ----------------------
   * Handles delete flow with confirmation logic.
   * (In real large apps, confirm can be moved to UI layer later.)
   */
  const deleteProduct = async (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`);
    if (!confirmDelete) return false;

    await store.remove(id);

    return {
      id,
      action: "delete",
    };
  };

  /**
   * 3. State Loading / Initialization
   * ----------------------------------
   * Fetch initial product data from store/service.
   */
  const fetchProducts = () => {
    return store.fetch();
  };

  return {
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
  };
};
