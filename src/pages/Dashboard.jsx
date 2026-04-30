import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import "@/styles/app.css";
import { ProductForm, ProductList } from "@/features/product";

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
