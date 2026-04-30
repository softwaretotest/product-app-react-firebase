import { useEffect, useState } from "react";
import { useProductStore } from "../features/product/product.store";
import ProductList from "../features/product/ProductList";
import ProductForm from "../features/product/ProductForm";
import EmptyState from "../components/EmptyState";

function Dashboard() {
  const { products, fetchProducts, add, update, remove } = useProductStore();

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!products.length && !showForm) {
    return <EmptyState onCreate={() => setShowForm(true)} />;
  }

  return (
    <div>
      {showForm && (
        <ProductForm onSubmit={add} onCancel={() => setShowForm(false)} />
      )}

      <button onClick={() => setShowForm(true)}>Add</button>

      <ProductList products={products} onEdit={setEditing} onDelete={remove} />
    </div>
  );
}

export default Dashboard;
