import { useEffect, useState, useRef } from "react";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  // uploadImage,  //-------for upload to Firestore-----
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
  const L = LANG[lang];
  const [loadingId, setLoadingId] = useState(null);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const formatCurrency = (value, lang) => {
    return new Intl.NumberFormat(lang === "th" ? "th-TH" : "de-CH", {
      style: "currency",
      currency: lang === "th" ? "THB" : "CHF",
    }).format(value);
  };
  const loadProducts = async () => {
    const list = await getProducts();

    // เรียงใหม่สุดขึ้นบน
    list.sort((a, b) => b.createdAt - a.createdAt);

    setProducts(list);

    // ลบสถานะ new หลัง 3 วิ
    setTimeout(() => {
      setProducts((prev) => prev.map((p) => ({ ...p, isNew: false })));
    }, 3000);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!preview) return;

    const handleKey = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        setPreview(null);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [preview]);

  useEffect(() => {
    if (highlightId) {
      setTimeout(() => {
        document.getElementById(highlightId)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

      // stop glow after 10s
      const timer = setTimeout(() => {
        setHighlightId(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [highlightId]);

  return (
    <div className="container">
      <div className="header">
        <div className="lang-switch">
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="th">ไทย</option>
            <option value="ch">Deutsch (CH)</option>
          </select>
        </div>
        <h1>{L.product}</h1>
        <div className="count-product">
          <h2>
            {products.length} {L.all_product}
          </h2>
        </div>
      </div>
      {/* ----- NEW (ADD) ----- */}
      {!editing && (
        <div className="form-container">
          <ProductForm
            lang={lang}
            setPreview={setPreview}
            onSubmit={async (data) => {
              const newItem = {
                ...data,
                createdAt: Date.now(),
                isNew: true,
              };
              const docId = await addProduct(newItem);
              await loadProducts();
              scrollToTop();
              setActionType("add");
              setHighlightId(docId); // use id as createdAt tempolary
              setTimeout(() => setHighlightId(null), 10000); // 10s
            }}
          />
        </div>
      )}
      {/* ----- EDIT ----- */}
      {editing && (
        <div className="form-container">
          <ProductForm
            initialData={editing}
            lang={lang}
            setPreview={setPreview}
            onSubmit={async (data) => {
              const updatedItem = {
                ...data,
                createdAt: Date.now(),
              };

              await updateProduct(editing.id, updatedItem);
              setEditing(null);
              await loadProducts();
              scrollToTop();
              setActionType("edit");
              setHighlightId(editing.id);
              setTimeout(() => setHighlightId(null), 10000);
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}
      {/* List all product */}
      {products.map((p) => (
        <div
          className={`card ${p.id === highlightId ? "highlight" : ""}`}
          id={p.id}
          key={p.id}
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
              style={{ width: "100px", cursor: "pointer" }}
              onClick={() => setPreview(p.image)}
            />
          )}
          {preview && (
            <div
              onClick={() => setPreview(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999, // Picture on top layer
              }}
            >
              {/* ❌ Close Button */}
              <button
                onClick={() => setPreview(null)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  fontSize: "24px",
                  background: "transparent",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>

              {/* 🖼️ Picture fullscreen */}
              <img
                src={preview}
                style={{ maxWidth: "90%", maxHeight: "90%" }}
              />
            </div>
          )}
          <h3>{p.name}</h3>
          <p>
            {L.price}: {formatCurrency(p.price, lang)}
          </p>
          <p>
            {L.stock}: {p.stock} {L.piece}
          </p>

          {!editing && (
            <button className="btn-edit" onClick={() => setEditing(p)}>
              {L.edit}
            </button>
          )}
          {!editing && (
            <button
              disabled={loadingId === p.id}
              className="btn-delete"
              onClick={async () => {
                if (!window.confirm(`${L.delete}? ${p.name}`)) return;
                setLoadingId(p.id);
                await deleteProduct(p.id);
                setLoadingId(null);
                loadProducts();
              }}
            >
              {loadingId === p.id ? "..." : L.delete}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

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
  const [focused, setFocused] = useState(null);
  const fileInputRef = useRef(null);
  const L = LANG[lang];

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file, 200);
    setImage(compressed);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    onSubmit({
      name,
      price: Number(price),
      stock: Number(stock),
      image,
    });

    setName("");
    setPrice("");
    setStock("");
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form className={isEdit ? "form-edit" : "form-add"} onSubmit={handleSubmit}>
      <h2>{isEdit ? `${L.edit}` : `${L.add_product}`}</h2>

      <div className="input-group">
        <p>{L.upload_image}</p>
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
            style={{ width: "65px", marginBottom: "5px", cursor: "pointer" }}
            onClick={() => setPreview(image)}
          />
        )}
      </div>

      <div className="input-group">
        <input
          placeholder={focused === "name" ? "" : L.name}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-group">
        <input
          placeholder={focused === "price" ? "" : L.price}
          value={price}
          onFocus={() => setFocused("price")}
          onBlur={() => setFocused(null)}
          onChange={(e) => setPrice(e.target.value)}
        />
        <span>{L.currency}</span>
      </div>

      <div className="input-group">
        <input
          placeholder={focused === "stock" ? "" : L.stock}
          value={stock}
          onFocus={() => setFocused("stock")}
          onBlur={() => setFocused(null)}
          onChange={(e) => setStock(e.target.value)}
        />
        <span>{L.piece}</span>
      </div>

      {!isEdit && (
        <button className="btn-add" type="submit">
          {L.add_product}
        </button>
      )}
      {isEdit && (
        <button className="btn-save" type="submit">
          {L.save}
        </button>
      )}
      {isEdit && (
        <button className="btn-cancel" type="button" onClick={onCancel}>
          {L.cancel}
        </button>
      )}
    </form>
  );
}

export default App;
