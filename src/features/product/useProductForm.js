// useProductForm.js
import { useState } from "react";
import { validateProduct } from "@/validators/product.validator";
import { L } from "@/i18n";
export function useProductForm(initialData, onSubmit) {
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    price: initialData?.price ?? "",
    stock: initialData?.stock ?? "",
    image: initialData?.image ?? "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [isDirty, setIsDirty] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
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
    isDirty,
    updateField,
    handleBlur,
    submit,
  };
}
