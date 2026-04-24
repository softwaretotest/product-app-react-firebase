import { useState, useRef, useEffect } from "react";
import { compressImage } from "@/utils/image";
import { validateProduct } from "@/validators/product.validator";
import { LANG } from "@/i18n";

// Product form for create and edit
function ProductForm({ initialData, onSubmit, onCancel, setPreview }) {
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [stock, setStock] = useState(initialData?.stock || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    stock: "",
  });
  // touched  = user has interacted with the field
  const [touched, setTouched] = useState({
    name: false,
    price: false,
    stock: false,
  });
  //functional update touched , because touched is an object {name , price , stock}
  //...prev takes everthing from touched , but updates only one field
  const handleBlur = (field, value, setter) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    setter(value.trim());
  };
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const [lang] = useState("th");
  const L = LANG[lang];
  // Auto focus on first input when form opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle image upload + compression
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const compressedImage = await compressImage(file, 200);
    setImage(compressedImage);
  };

  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validateProduct({ name, price, stock }, lang);
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);

    if (hasError) {
      setTouched({
        name: true,
        price: true,
        stock: true,
      });
      return;
    }

    onSubmit({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      image,
    });
  };

  return (
    <form
      className={initialData ? "form-edit" : "form-add"}
      onSubmit={handleSubmit}
    >
      <h2>{initialData ? L.edit : L.add_product}</h2>

      {/* Image Upload */}
      <div className="input-group">
        <span>{L.upload_image}</span>

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

      {/* Name */}
      <input
        ref={inputRef}
        className={`input ${touched.name && errors.name ? "input-error" : ""}`}
        placeholder={L.name}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        //onBlur = when input loses focus
        onBlur={() => handleBlur("name", name, setName)}
      />

      {touched.name && errors.name && (
        <p className="error-text">{errors.name}</p>
      )}

      {/* Price */}
      <div className="input-group">
        <input
          className={`input ${touched.price && errors.price ? "input-error" : ""}`}
          placeholder={L.price}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onBlur={() => handleBlur("price", price, setPrice)}
        />
        <span>{L.currency}</span>
      </div>
      {touched.price && errors.price && (
        <p className="error-text">{errors.price}</p>
      )}

      {/* Stock */}
      <div className="input-group">
        <input
          className={`input ${touched.stock && errors.stock ? "input-error" : ""}`}
          placeholder={L.stock}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          onBlur={() => handleBlur("stock", stock, setStock)}
        />
        <span>{L.piece}</span>
      </div>
      {touched.stock && errors.stock && (
        <p className="error-text">{errors.stock}</p>
      )}

      {/* Submit */}
      <button className="btn-add" type="submit">
        {initialData ? L.save : L.add_product}
      </button>

      {/* Cancel */}
      <button className="btn-cancel" type="button" onClick={onCancel}>
        {L.cancel}
      </button>
    </form>
  );
}

export default ProductForm;
