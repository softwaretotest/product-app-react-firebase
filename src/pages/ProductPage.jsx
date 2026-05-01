import { useEffect, useState } from "react";

import useProductStore from "@/features/product/store/product.store";
import { ProductForm, ProductList } from "@/features/product";
import Modal from "@/components/Modal";
import { L, formatCurrency } from "@/i18n";
import "@/styles/app.css";

// 👉 Product Controller (business logic layer)
import { productController } from "@/features/product/controllers/product.controller";

/**
 * ProductPage
 * ------------
 * This page is responsible for:
 * - UI rendering (ProductForm, ProductList)
 * - UI state management (modal, preview, highlight)
 * - Delegating business logic to Product Controller
 *
 * IMPORTANT:
 * This component should NOT directly handle store mutations anymore.
 */
function ProductPage() {
  const controller = productController();

  const products = useProductStore((state) => state.products);
  const loadingId = useProductStore((state) => state.loadingId);

  const fetch = useProductStore((state) => state.fetch);

  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  /** warn before closing modal */
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /**
   * Load initial product data when page mounts
   */
  useEffect(() => {
    fetch();
  }, [fetch]);

  /**
   * Close preview image when ESC key is pressed
   */
  useEffect(() => {
    if (!preview) return;

    const handleKey = (e) => {
      if (e.key === "Escape") setPreview(null);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [preview]);

  /**
   * Automatically scroll to highlighted product after add/edit action
   */
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

  /**
   * Lock body scroll when modal is open
   */
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

  /**
   * Auto focus first input when modal opens
   */
  useEffect(() => {
    if (showAddForm || editing) {
      document.querySelector("input")?.focus();
    }
  }, [showAddForm, editing]);

  // ---------- ACTIONS (NOW CONTROLLED BY CONTROLLER) ----------

  /**
   * Handle Add Product
   * Delegates creation logic to Product Controller
   */
  const handleAdd = async (data) => {
    const result = await controller.addProduct(data);

    setShowAddForm(false);
    setActionType(result.action);
    setHighlightId(result.id);
    setHasUnsavedChanges(false);
  };

  /**
   * Handle Edit Product
   * Delegates update logic to Product Controller
   */
  const handleEdit = async (data) => {
    if (!editing) return;

    const result = await controller.updateProduct(editing.id, data);

    setEditing(null);
    setActionType(result.action);
    setHighlightId(result.id);
    setHasUnsavedChanges(false);
  };

  /**
   * Handle Delete Product
   * Delegates delete logic to Product Controller
   */
  const handleDelete = async (id, name) => {
    const result = await controller.deleteProduct(id, name);
    if (!result) return;
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
              if (hasUnsavedChanges) {
                const ok = window.confirm(L.warn_leaving);
                if (!ok) return;
              }
              setShowAddForm(false);
              setEditing(null);
              setHasUnsavedChanges(false);
            }}
          >
            <ProductForm
              key={editing?.id || "new"}
              initialData={editing}
              onSubmit={editing ? handleEdit : handleAdd}
              onCancel={() => {
                if (hasUnsavedChanges) {
                  const ok = window.confirm(L.warn_leaving);
                  if (!ok) return;
                }

                setShowAddForm(false);
                setEditing(null);
                setHasUnsavedChanges(false); // reset
              }}
              setPreview={setPreview}
              onDirtyChange={setHasUnsavedChanges}
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

export default ProductPage;
