import { L } from "@/i18n";

export function validateName(name) {
  if (!name || name.trim() === "") {
    return L.insert_data;
  }

  return "";
}
// Validate price
export function validateAmount(amount) {
  const value = Number(amount);

  // if (!amount) {  // cannot check like this , becaus amount=0 is valid
  if (amount === "" || amount === null || amount === undefined) {
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
