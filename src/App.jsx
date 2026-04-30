import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "@/features/product";
import Modal from "@/components/Modal";
import "@/styles/app.css";
import { L, formatCurrency } from "@/i18n";
import { ProductForm, ProductList } from "@/features/product";

function App() {
  const [products, setProducts] = useState([]);
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadProducts = async () => {
    const list = await getProducts();
    list.sort((a, b) => b.createdAt - a.createdAt);
    setProducts(list);
  };

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  // preview ESC close
  useEffect(() => {
    if (!preview) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [preview]);

  // auto scroll highlight
  useEffect(() => {
    if (!highlightId) return;

    setTimeout(() => {
      const el = document.getElementById(highlightId);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 200);

    const clear = setTimeout(() => setHighlightId(null), 10000);

    return () => clearTimeout(clear);
  }, [highlightId]);

  useEffect(() => {
    if (showAddForm || editing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showAddForm, editing]);

  useEffect(() => {
    if (showAddForm || editing) {
      document.querySelector("input")?.focus();
    }
  }, [showAddForm, editing]);

  // ---------- ACTIONS ----------
  const handleAdd = async (data) => {
    const newItem = {
      ...data,
      createdAt: Date.now(),
    };

    const docId = await addProduct(newItem);
    await loadProducts();

    setShowAddForm(false);

    // 🔥 scroll top ONLY here
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActionType("add");
    setHighlightId(docId);
    setIsDirty(false);
  };

  const handleEdit = async (data) => {
    if (!editing) return;
    const id = editing.id;
    await updateProduct(id, {
      ...data,
      createdAt: Date.now(),
    });

    setEditing(null);
    await loadProducts();

    setActionType("edit");
    setHighlightId(id);
    setEditing(null); // close modal
    setIsDirty(false);

    // ❌ no scroll
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`${L.delete}? ${name}`)) return;

    setLoadingId(id);
    await deleteProduct(id);
    setLoadingId(null);

    loadProducts();
  };

  return (
    <div className="container">
      {/* PREVIEW */}
      {preview && (
        <div className="preview-overlay" onClick={() => setPreview(null)}>
          <button className="preview-close" onClick={() => setPreview(null)}>
            ✕
          </button>
          <img src={preview} alt="preview" />
        </div>
      )}
      {/* FORM */}
      <div className="form-container">
        {(showAddForm || editing) && (
          <Modal
            onClose={() => {
              if (isDirty) {
                const ok = window.confirm(L.warn_leaving);
                if (!ok) return;
              }
              setShowAddForm(false);
              setEditing(null);
              setIsDirty(false);
            }}
          >
            <ProductForm
              key={editing?.id || "new"}
              initialData={editing}
              onSubmit={editing ? handleEdit : handleAdd}
              onCancel={() => {
                if (isDirty) {
                  const ok = window.confirm(L.warn_leaving);
                  if (!ok) return;
                }

                setShowAddForm(false);
                setEditing(null);
                setIsDirty(false); // reset
              }}
              setPreview={setPreview}
              onDirtyChange={setIsDirty}
            />
          </Modal>
        )}
        <button className="btn-add" onClick={() => setShowAddForm(true)}>
          {L.add_product}
        </button>
      </div>

      <span>
        {L.product} {products.length} {L.assort}
      </span>

      {/* LIST */}
      <ProductList
        products={products}
        highlightId={highlightId}
        actionType={actionType}
        setPreview={setPreview}
        formatCurrency={formatCurrency}
        loadingId={loadingId}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
