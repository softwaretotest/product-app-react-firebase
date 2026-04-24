// Main page for product dashboard
import { useEffect, useState } from "react";
import { useProductStore } from "../features/product/product.store";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";

function Dashboard() {
  const { products, fetchProducts, add, update, remove, loadingId } =
    useProductStore();

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle add
  const handleAdd = async (data) => {
    await add(data);
    setShowForm(false);
  };

  // Handle edit
  const handleEdit = async (data) => {
    await update(editing.id, data);
    setEditing(null);
  };

  return (
    <div>
      {showForm && (
        <ProductForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      <button onClick={() => setShowForm(true)}>Add</button>

      {products.map((p) => (
        <ProductCard
          key={p.id}
          p={p}
          onEdit={setEditing}
          onDelete={remove}
          loadingId={loadingId}
        />
      ))}
    </div>
  );
}

export default Dashboard;
