import { L } from "@/i18n";

export default function NavDrawer({ onSelect, collapsed, onToggle }) {
  const menuItems = [
    { label: L.product, value: "products", icon: "📦" },
    { label: L.order, value: "orders", icon: "🧾" },
    { label: L.customer, value: "customers", icon: "👤" },
  ];

  return (
    <div className="nav">
      {/* TOGGLE BUTTON */}
      <button className="btn-menu" onClick={onToggle}>
        {collapsed ? "☰" : "✕"}
      </button>

      <div className="drawer-body">
        {menuItems.map((item) => (
          <div
            key={item.value}
            className="drawer-item"
            onClick={() => onSelect(item.value)}
          >
            <span className="icon">{item.icon}</span>

            {!collapsed && <span className="label">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
