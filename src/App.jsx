import { useEffect, useState } from "react";

import useProductStore from "@/features/product/store/product.store";
import Modal from "@/components/Modal";
import "@/styles/app.css";
import { L, formatCurrency } from "@/i18n";
import { ProductForm, ProductList } from "@/features/product";

function App() {
  const products = useProductStore((state) => state.products);
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadingId = useProductStore((state) => state.loadingId);

  const [isDirty, setIsDirty] = useState(false);

  const fetch = useProductStore((state) => state.fetch);

  useEffect(() => {
    fetch();
  }, [fetch]);

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
  const add = useProductStore((state) => state.add);
  const handleAdd = async (data) => {
    const docId = await add(data); // ✅ call store
    setShowAddForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActionType("add");
    setHighlightId(docId);
    setIsDirty(false);
  };

  //update → store update → UI auto. render
  const update = useProductStore((state) => state.update);
  const handleEdit = async (data) => {
    if (!editing) return;

    const id = editing.id;

    await update(id, {
      ...data,
      createdAt: Date.now(),
    });
    setEditing(null);
    setActionType("edit");
    setHighlightId(id);
    setIsDirty(false);
  };

  const remove = useProductStore((state) => state.remove);
  const handleDelete = async (id, name) => {
    if (!window.confirm(`${L.delete}? ${name}`)) return;
    await remove(id);
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
