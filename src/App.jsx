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
  const [lang] = useState("th");
  const [loadingId, setLoadingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
        <ShowForm
          showAddForm={showAddForm}
          editing={editing}
          onClose={() => {
            setShowAddForm(false);
            setEditing(null);
          }}
          onSubmit={editing ? handleEdit : handleAdd}
          lang={lang}
          setPreview={setPreview}
        />
        <button className="btn-add" onClick={() => setShowAddForm(true)}>
          {L.add_product}
        </button>
      </div>

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
// SHOW FORM
//////////////////////////////////////////////////////////
function ShowForm({
  showAddForm,
  editing,
  onClose,
  onSubmit,
  lang,
  setPreview,
}) {
  if (!showAddForm && !editing) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <ProductForm
          key={editing?.id || "new"}
          initialData={editing}
          onSubmit={onSubmit}
          onCancel={onClose}
          lang={lang}
          setPreview={setPreview}
        />
      </div>
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
          {actionType === "edit" ? L.update : L.new}
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
        {L.price}: {formatCurrency(p.price, lang)} {L.currency}
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
        <span>{L.upload_image}</span>
        {/* upload image box */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        {/* little image */}
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
      <div className="input-group">
        <input
          placeholder={L.price}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <span>{L.currency}</span>
      </div>

      {/* STOCK */}
      <div className="input-group">
        <input
          placeholder={L.stock}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <span>{L.piece}</span>
      </div>

      <button className="btn-add" type="submit">
        {isEdit ? L.save : L.add_product}
      </button>

      <button className="btn-cancel" type="button" onClick={onCancel}>
        {L.cancel}
      </button>
    </form>
  );
}

export default App;
