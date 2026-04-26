import { L } from "@/i18n"; // (ให้ path ถูกด้วย)
// Validate product name
export function validateName(name) {
  // const L = getLang(currentLang);

  if (!name || name.trim() === "") {
    return L.insert_data;
  }

  return "";
}
// Validate price
export function validateAmount(amount) {
  const value = Number(amount);

  if (!amount) {
    return L.insert_data;
  }

  if (isNaN(value)) {
    return L.must_number;
  }

  if (value < 0) {
    return L.must_positive;
  }

  return "";
}

// Validate entire product form
export function validateProduct(data) {
  return {
    name: validateName(data.name),
    price: validateAmount(data.price),
    stock: validateAmount(data.stock),
  };
}
