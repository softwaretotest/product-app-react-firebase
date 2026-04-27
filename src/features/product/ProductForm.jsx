import { useRef, useEffect } from "react";
import { compressImage } from "@/utils/image";
import { useProductForm } from "./useProductForm";
import { L, getCurrencyLabel } from "@/i18n";

function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  setPreview,
  onDirtyChange,
}) {
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const { form, isDirty, errors, touched, updateField, handleBlur, submit } =
    useProductForm(initialData, onSubmit);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const compressedImage = await compressImage(file, 200);
    updateField("image", compressedImage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    onDirtyChange?.(isDirty); //if there is onDirtyChange, then call isDirty , else no error
  }, [isDirty, onDirtyChange]);

  return (
    <form
      className={initialData ? "form-edit" : "form-add"}
      onSubmit={handleSubmit}
    >
      <h2>{initialData ? L.edit : L.add_product}</h2>

      {/* Image */}
      <div className="input-group">
        <span>{L.upload_image}</span>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        {form.image && (
          <img
            className="img-product img-product--form"
            src={form.image}
            alt="preview"
            onClick={() => setPreview(form.image)}
          />
        )}
      </div>

      {/* Name */}
      <div className="input-group">
        <span>{L.name}</span>
        <input
          ref={inputRef}
          className={`input ${
            touched.name && errors.name ? "input-error" : ""
          }`}
          placeholder={L.product_name}
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
      </div>
      {touched.name && errors.name && (
        <p className="error-text">{errors.name}</p>
      )}

      {/* Price */}
      <div className="input-group">
        <input
          className={`input ${
            touched.price && errors.price ? "input-error" : ""
          }`}
          placeholder={L.price}
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
          onBlur={() => handleBlur("price")}
        />
        <span>{getCurrencyLabel()}</span>
      </div>
      {touched.price && errors.price && (
        <p className="error-text">{errors.price}</p>
      )}

      {/* Stock */}
      <div className="input-group">
        <input
          className={`input ${
            touched.stock && errors.stock ? "input-error" : ""
          }`}
          placeholder={L.stock}
          value={form.stock}
          onChange={(e) => updateField("stock", e.target.value)}
          onBlur={() => handleBlur("stock")}
        />
        <span>{L.piece}</span>
      </div>
      {touched.stock && errors.stock && (
        <p className="error-text">{errors.stock}</p>
      )}

      <button className="btn-add" type="submit">
        {initialData ? L.save : L.add_product}
      </button>

      <button className="btn-cancel" type="button" onClick={onCancel}>
        {L.cancel}
      </button>
    </form>
  );
}

export default ProductForm;
