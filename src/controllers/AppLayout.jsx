import { useState } from "react";
import NavDrawer from "@/features/navigation/NavDrawer";

import ProductPage from "@/features/product/product.page.jsx";
import OrderPage from "@/pages/OrderPage";
import CustomerPage from "@/pages/CustomerPage";

export default function AppLayout() {
  const [page, setPage] = useState("products");
  const [collapsed, setCollapsed] = useState(false);

  const renderPage = () => {
    switch (page) {
      case "orders":
        return <OrderPage />;
      case "customers":
        return <CustomerPage />;
      default:
        return <ProductPage />;
    }
  };

  return (
    <div className="app-shell">
      {/* SIDEBAR (ChatGPT style but safe) */}
      <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>
        <NavDrawer
          onSelect={setPage}
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
      </aside>

      {/* MAIN AREA (legacy safe) */}
      <div className="main-area">
        <header className="header">Header</header>

        <main className="content">{renderPage()}</main>
      </div>
    </div>
  );
}
