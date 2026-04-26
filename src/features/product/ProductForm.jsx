import { useProductForm } from "./useProductForm";
import { L, getCurrencyLabel } from "@/i18n";

function ProductForm({ initialData, onSubmit }) {
  const { form, updateField, handleBlur, submit } = useProductForm(
    initialData,
    L,
    onSubmit,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        onBlur={() => handleBlur("name")}
      />

      <input
        value={form.price}
        onChange={(e) => updateField("price", e.target.value)}
        onBlur={() => handleBlur("price")}
      />
      <span>{getCurrencyLabel()}</span>

      <input
        value={form.stock}
        onChange={(e) => updateField("stock", e.target.value)}
        onBlur={() => handleBlur("stock")}
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default ProductForm;
