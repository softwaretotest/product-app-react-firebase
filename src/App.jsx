import { useEffect, useState, useRef } from "react";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "./services/productService";
import "./styles/app.css";
import { compressImage } from "./utils/image";
import { LANG } from "./i18n";

function App() {
  const [products, setProducts] = useState([]);
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [lang, setLang] = useState("th");
  const [loadingId, setLoadingId] = useState(null);

  const L = LANG[lang];

  const formatCurrency = (value, lang) => {
    return new Intl.NumberFormat(lang === "th" ? "th-TH" : "de-CH", {
      style: "currency",
      currency: lang === "th" ? "THB" : "CHF",
    }).format(value);
  };

  const loadProducts = async () => {
    const list = await getProducts();
    list.sort((a, b) => b.createdAt - a.createdAt);
    setProducts(list);
  };

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

  // ---------- ACTIONS ----------
  const handleAdd = async (data) => {
    const newItem = {
      ...data,
      createdAt: Date.now(),
    };

    const docId = await addProduct(newItem);
    await loadProducts();

    setActionType("add");
    setHighlightId(docId);
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
    setHighlightId(editing.id);
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
      <FormSection
        editing={editing}
        lang={lang}
        setPreview={setPreview}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onCancel={() => setEditing(null)}
      />

      {/* LIST */}
      <ProductList
        products={products}
        highlightId={highlightId}
        actionType={actionType}
        preview={preview}
        setPreview={setPreview}
        formatCurrency={formatCurrency}
        lang={lang}
        loadingId={loadingId}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}

//////////////////////////////////////////////////////////
// FORM SECTION
//////////////////////////////////////////////////////////
function FormSection({ editing, lang, setPreview, onAdd, onEdit, onCancel }) {
  return (
    <div className="form-container">
      <ProductForm
        key={editing?.id || "new"}
        initialData={editing}
        lang={lang}
        setPreview={setPreview}
        onSubmit={editing ? onEdit : onAdd}
        onCancel={editing ? onCancel : null}
      />
    </div>
  );
}

//////////////////////////////////////////////////////////
// PRODUCT LIST
//////////////////////////////////////////////////////////
function ProductList({
  products,
  highlightId,
  actionType,
  preview,
  setPreview,
  formatCurrency,
  lang,
  loadingId,
  onEdit,
  onDelete,
}) {
  const L = LANG[lang];

  return (
    <div className="list-container">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          p={p}
          highlightId={highlightId}
          actionType={actionType}
          preview={preview}
          setPreview={setPreview}
          formatCurrency={formatCurrency}
          lang={lang}
          loadingId={loadingId}
          onEdit={onEdit}
          onDelete={onDelete}
          L={L}
        />
      ))}
    </div>
  );
}

//////////////////////////////////////////////////////////
// PRODUCT CARD
//////////////////////////////////////////////////////////
function ProductCard({
  p,
  highlightId,
  actionType,
  preview,
  setPreview,
  formatCurrency,
  lang,
  loadingId,
  onEdit,
  onDelete,
  L,
}) {
  return (
    <div
      className={`card ${p.id === highlightId ? "highlight" : ""}`}
      id={p.id}
    >
      {p.id === highlightId && (
        <span className="badge-new">
          {actionType === "edit" ? "UPDATED" : "NEW"}
        </span>
      )}

      {p.image && (
        <img
          src={p.image}
          alt={p.name}
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() => setPreview(p.image)}
        />
      )}

      <h3>{p.name}</h3>
      <p>
        {L.price}: {formatCurrency(p.price, lang)}
      </p>
      <p>
        {L.stock}: {p.stock} {L.piece}
      </p>

      <button className="btn-edit" onClick={() => onEdit(p)}>
        {L.edit}
      </button>

      <button
        disabled={loadingId === p.id}
        className="btn-delete"
        onClick={() => onDelete(p.id, p.name)}
      >
        {loadingId === p.id ? "..." : L.delete}
      </button>
    </div>
  );
}

//////////////////////////////////////////////////////////
// PRODUCT FORM (เหมือนเดิม + clean นิดเดียว)
//////////////////////////////////////////////////////////
function ProductForm({
  initialData: isEdit,
  onSubmit,
  onCancel,
  lang,
  setPreview,
}) {
  const [name, setName] = useState(isEdit?.name || "");
  const [price, setPrice] = useState(isEdit?.price || "");
  const [stock, setStock] = useState(isEdit?.stock || "");
  const [image, setImage] = useState(isEdit?.image || "");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const L = LANG[lang];

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const compressed = await compressImage(file, 200);
    setImage(compressed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError(L.error_text);
      return;
    }

    setError("");

    onSubmit({
      name: trimmed,
      price: Number(price),
      stock: Number(stock),
      image,
    });
  };

  return (
    <form className={isEdit ? "form-edit" : "form-add"} onSubmit={handleSubmit}>
      <h2>{isEdit ? L.edit : L.add_product}</h2>

      {/* ✅ IMAGE UPLOAD */}
      <div className="input-group">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {image && (
          <img
            src={image}
            alt="preview"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              marginLeft: "8px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => setPreview(image)}
          />
        )}
      </div>

      {/* NAME */}
      <input
        className={error ? "input-error" : ""}
        placeholder={L.name}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError("");
        }}
        onBlur={() => {
          const trimmed = name.trim();
          setName(trimmed);
          if (!trimmed) setError(L.error_text);
        }}
      />

      {error && <p className="error-text">{error}</p>}

      {/* PRICE */}
      <input
        placeholder={L.price}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* STOCK */}
      <input
        placeholder={L.stock}
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <button type="submit">{isEdit ? L.save : L.add_product}</button>

      {isEdit && (
        <button type="button" onClick={onCancel}>
          {L.cancel}
        </button>
      )}
    </form>
  );
}

export default App;
