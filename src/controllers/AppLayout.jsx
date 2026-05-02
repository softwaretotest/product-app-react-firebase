import { useState } from "react";
import NavDrawer from "@/features/navigation/NavDrawer";

import ProductPage from "@/features/product/product.page.jsx";
import OrderPage from "@/pages/OrderPage";
import CustomerPage from "@/pages/CustomerPage";

export default function AppLayout() {
  const [page, setPage] = useState("products");

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
    <div className="layout">
      <aside className="sidebar">
        <NavDrawer onSelect={setPage} />
      </aside>

      <header className="header">Header</header>

      <main className="content">{renderPage()}</main>
    </div>
  );
}
