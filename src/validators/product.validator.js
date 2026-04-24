import { LANG } from "../i18n"; // (ให้ path ถูกด้วย)
// Validate product name
export function validateName(name, lang) {
  const L = LANG[lang];

  if (!name || name.trim() === "") {
    return L.error_text;
  }

  return "";
}
// Validate price
export function validatePrice(price, lang) {
  const value = Number(price);

  if (!price) {
    return "Price is required";
  }

  if (isNaN(value)) {
    return "Price must be a number";
  }

  if (value < 0) {
    return "Price cannot be negative";
  }

  return "";
}

// Validate stock
export function validateStock(stock, lang) {
  const value = Number(stock);

  if (!stock) {
    return "Stock is required";
  }

  if (isNaN(value)) {
    return "Stock must be a number";
  }

  if (value < 0) {
    return "Stock cannot be negative";
  }

  return "";
}

// Validate entire product form
export function validateProduct(data, lang) {
  return {
    name: validateName(data.name, lang),
    price: validatePrice(data.price, lang),
    stock: validateStock(data.stock, lang),
  };
}
