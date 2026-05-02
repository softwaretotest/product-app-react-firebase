// product.store.js

import createCrudStore from "@/store/crud.store";
import createWrapperStore from "@/store/wrapper.store";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/features/product/product.service.js";

// base
const useProductBaseStore = createCrudStore({
  getItems: getProducts,
  addItem: addProduct,
  updateItem: updateProduct,
  deleteItem: deleteProduct,
});

// wrapper
const useProductStore = createWrapperStore(useProductBaseStore, "products");

export default useProductStore;
