import React from "react";
import { Bell, CalendarDays, Download, Search } from "lucide-react";

const pageTitles = {
  dashboard: "Overview",
  analytics: "Analytics",
  products: "Products",
  offers: "Offers",
  inventory: "Inventory",
  orders: "Orders",
  sales: "Sales",
  customer: "Customer",
  newsletter: "Newsletter",
  settings: "Settings",
};

export default function Header({ activePage }) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="admin-header">
      <div>
        <span className="header-kicker">Admin dashboard</span>
        <h1>{pageTitles[activePage] || activePage}</h1>
      </div>

      <label className="admin-search">
        <Search size={17} />
        <input type="search" placeholder="Search orders, products, customers" />
      </label>

      <div className="header-actions">
        <button className="icon-button" type="button" title="Export report">
          <Download size={18} />
        </button>
        <button className="icon-button notification" type="button" title="Notifications">
          <Bell size={18} />
          <span />
        </button>
        <div className="date-pill">
          <CalendarDays size={16} />
          <span>{today}</span>
        </div>
      </div>
    </header>
  );
}
