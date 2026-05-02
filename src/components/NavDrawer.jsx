import { useState } from "react";

import ProductPage from "@/features/product/product.page.jsx";
import OrderPage from "@/pages/OrderPage";
import CustomerPage from "@/pages/CustomerPage";

import { L } from "@/i18n";

export default function NavDrawer() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState("products");

  const menuItems = [
    { label: L.product, value: L.product },
    { label: L.order, value: L.order },
    { label: L.customer, value: L.customer },
  ];

  const handleSelect = (value) => {
    setPage(value);
    setOpen(false);
  };

  const renderPage = () => {
    switch (page) {
      case L.order:
        return <OrderPage />;
      case L.customer:
        return <CustomerPage />;
      default:
        return <ProductPage />;
    }
  };

  return (
    <>
      {/* toggle button */}
      <button className="btn-menu" onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* overlay */}
      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)} />
      )}

      {/* drawer */}
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

      {/* PAGE RENDER  */}
      <div style={{ paddingTop: "50px" }}>{renderPage()}</div>
    </>
  );
}
