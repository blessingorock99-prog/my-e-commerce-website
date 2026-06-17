import React from "react";
import {
  Archive,
  BadgePercent,
  BarChart3,
  ChevronRight,
  Home,
  LineChart,
  Mail,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Users,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "products", label: "Products", icon: Package },
  { id: "offers", label: "Offers", icon: BadgePercent },
  { id: "inventory", label: "Inventory", icon: Archive },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "sales", label: "Sales", icon: LineChart },
  { id: "customer", label: "Customer", icon: Users },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="admin-sidebar" aria-label="Admin navigation">
      <div className="brand-block">
        <div className="brand-mark">
          <ShoppingBag size={21} />
        </div>
        <div>
          <strong>SwiftDrop</strong>
          <span>Commerce</span>
        </div>
      </div>

      <div className="admin-profile">
        <div className="admin-avatar">BO</div>
        <div>
          <strong>Blessing Orock</strong>
          <span>Store Admin</span>
        </div>
      </div>

      <nav className="admin-nav">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              className={`admin-nav-item${isActive ? " active" : ""}`}
              onClick={() => setActivePage(id)}
              type="button"
              title={label}
            >
              <Icon size={18} />
              <span>{label}</span>
              {isActive && <ChevronRight className="nav-chevron" size={16} />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <SlidersHorizontal size={17} />
        <span>Store health: 94%</span>
      </div>
    </aside>
  );
}
