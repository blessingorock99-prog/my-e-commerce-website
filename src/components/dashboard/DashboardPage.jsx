import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import OverviewPage from "./OverviewPage";
import AnalyticsPage from "./AnalyticsPage";
import {
  InventoryAdminPage,
  OffersAdminPage,
  OrdersAdminPage,
  ProductsAdminPage,
  SalesAdminPage,
} from "./SectionPages";

const sectionCopy = {
  products: {
    title: "Products",
    body: "Manage featured products, pricing, stock visibility, and launch-ready collections from one focused workspace.",
  },
  offers: {
    title: "Offers",
    body: "Track coupon performance, discount campaigns, and bundle deals before they affect your sales margin.",
  },
  inventory: {
    title: "Inventory",
    body: "Monitor low-stock products, warehouse movement, and reorder pressure across your catalog.",
  },
  orders: {
    title: "Orders",
    body: "Review new, processing, shipped, and delivered orders with fast access to fulfillment signals.",
  },
  sales: {
    title: "Sales",
    body: "Compare revenue, order volume, conversion rate, and average order value across time periods.",
  },
  customer: {
    title: "Customer",
    body: "Understand repeat buyers, active accounts, abandoned carts, and customer support follow-ups.",
  },
  newsletter: {
    title: "Newsletter",
    body: "Plan email campaigns, subscriber growth, and product drops for your best customer segments.",
  },
  settings: {
    title: "Settings",
    body: "Control store profile details, payment options, fulfillment preferences, and dashboard access.",
  },
};

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    document.body.classList.add("dashboard-active");
    return () => document.body.classList.remove("dashboard-active");
  }, []);

  return (
    <div id="dashboard-root">
      <div className="admin-shell">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <div className="admin-main">
          <Header activePage={activePage} />
          <main className="admin-content">
            {activePage === "dashboard" && <OverviewPage />}
            {activePage === "analytics" && <AnalyticsPage />}
            {activePage === "products" && <ProductsAdminPage />}
            {activePage === "offers" && <OffersAdminPage />}
            {activePage === "inventory" && <InventoryAdminPage />}
            {activePage === "orders" && <OrdersAdminPage />}
            {activePage === "sales" && <SalesAdminPage />}
            {!["dashboard", "analytics", "products", "offers", "inventory", "orders", "sales"].includes(activePage) && (
              <section className="admin-placeholder">
                <div>
                  <span className="placeholder-kicker">Coming next</span>
                  <h2>{sectionCopy[activePage]?.title || activePage}</h2>
                  <p>{sectionCopy[activePage]?.body}</p>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
