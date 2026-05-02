import { useState } from "react";
import { validateProduct } from "@/features/product/product.validator";
import { L } from "@/i18n";
function useProductForm(initialData, onSubmit) {
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    price: initialData?.price ?? "",
    stock: initialData?.stock ?? "",
    image: initialData?.image ?? "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    // trim string only eg. name , not price, amount
    const value = form[field];
    updateField(field, typeof value === "string" ? value.trim() : value);
  };

  const submit = () => {
    const newErrors = validateProduct(form);
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      setTouched({
        name: true,
        price: true,
        stock: true,
      });
      return false;
    }

    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });

    return true;
  };

  return {
    form,
    errors,
    touched,
    hasUnsavedChanges: hasUnsavedChanges,
    updateField,
    handleBlur,
    submit,
  };
}
export default useProductForm;
