import { useState } from "react";

import ProductPage from "@/features/product/product.page.jsx";
import OrderPage from "@/pages/OrderPage";
import CustomerPage from "@/pages/CustomerPage";

import { L } from "@/i18n";

export default function NavDrawer({ onSelect }) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: L.product, value: "products" },
    { label: L.order, value: "orders" },
    { label: L.customer, value: "customers" },
  ];

  const handleSelect = (value) => {
    onSelect(value);
    setOpen(false);
  };

  return (
    <>
      <button className="btn-menu" onClick={() => setOpen(true)}>
        ☰
      </button>

      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)} />
      )}

      <div className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>{L.menu}</h3>
          <button className="btn-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {menuItems.map((item) => (
            <div
              key={item.value}
              className="drawer-item"
              onClick={() => handleSelect(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
