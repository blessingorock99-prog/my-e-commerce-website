import React, { useEffect, useState } from "react";
import {
  BadgePercent,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Package,
  PackageCheck,
  Search,
  ShoppingCart,
  Smartphone,
  TrendingUp,
  Truck,
  Plus,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiRequest } from "../../lib/api";
import { fetchUserOrdersWithLocalFallback, getCurrentUserId } from "../../lib/orders";
import ProductFormModal from "./ProductFormModal";

const offers = [];

const inventoryRows = [];

const salesData = [
  { day: "Mon", iphone: 14200, sneakers: 3200 },
  { day: "Tue", iphone: 18600, sneakers: 4100 },
  { day: "Wed", iphone: 16400, sneakers: 5200 },
  { day: "Thu", iphone: 22100, sneakers: 6700 },
  { day: "Fri", iphone: 28400, sneakers: 7600 },
  { day: "Sat", iphone: 25100, sneakers: 8900 },
  { day: "Sun", iphone: 31800, sneakers: 9400 },
];

const statusClass = {
  Active: "accent",
  Featured: "info",
  Hot: "warning",
  Sale: "success",
  Trending: "info",
  Healthy: "success",
  Watch: "warning",
  Low: "danger",
  Paid: "success",
  Processing: "info",
  Shipped: "accent",
  Delivered: "success",
  Pending: "warning",
  pending: "warning",
  processing: "info",
  shipped: "accent",
  delivered: "success",
  canceled: "danger",
};

function getOrderItems(order) {
  return order.items || order.orderItems || order.products || [];
}

function getOrderTotal(order) {
  return Number(order.totalPrice || order.totalAmount || 0);
}

function formatOrderDate(value) {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function MiniStats({ items }) {
  return (
    <section className="section-stat-grid">
      {items.map(({ label, value, sub, icon: Icon }) => (
        <article className="section-stat" key={label}>
          <div>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{sub}</small>
          </div>
          <Icon size={22} />
        </article>
      ))}
    </section>
  );
}

export function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/product/all-products");
      const list = Array.isArray(data) ? data : data.products || data.data || [];
      setProducts(list);
    } catch (err) {
      setError(err.message || "Failed to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (product) => {
    const id = product._id || product.id;
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      await apiRequest(`/product/delete-product/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      alert(err.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (savedProduct) => {
    const savedId = savedProduct._id || savedProduct.id;
    setProducts((prev) => {
      const exists = prev.some((p) => (p._id || p.id) === savedId);
      if (exists) {
        return prev.map((p) => ((p._id || p.id) === savedId ? savedProduct : p));
      }
      return [savedProduct, ...prev];
    });
    setShowForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      String(p.name || "").toLowerCase().includes(term) ||
      String(p.category || "").toLowerCase().includes(term) ||
      String(p.brand || "").toLowerCase().includes(term)
    );
  });

  const featuredCount = products.filter((p) => p.isFeatured).length;
  const lowStockCount = products.filter((p) => Number(p.stock) <= 10).length;

  return (
    <div className="dashboard-view">
      <MiniStats
        items={[
          { label: "Total Products", value: String(products.length), sub: "All products in catalog", icon: Boxes },
          { label: "Featured", value: String(featuredCount), sub: "Highlighted on storefront", icon: Smartphone },
          { label: "Low Stock", value: String(lowStockCount), sub: "10 units or fewer", icon: Package },
        ]}
      />
      <section className="panel">
        <div className="panel-head products-panel-head">
          <div>
            <h2>Product Catalog</h2>
            <p>
              {loading
                ? "Loading products..."
                : `${filteredProducts.length} of ${products.length} product${products.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="products-toolbar">
            <div className="search-bar">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="btn-primary add-product-btn"
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {error && <div className="form-error" style={{ margin: "0 1.5rem" }}>{error}</div>}

        {loading ? (
          <div className="catalog-loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="catalog-empty">
            {products.length === 0
              ? "No products yet. Click \"Add Product\" to create your first one."
              : "No products match your search."}
          </div>
        ) : (
          <div className="catalog-grid">
            {filteredProducts.map((product) => {
              const id = product._id || product.id;
              const image = Array.isArray(product.imageURLs) && product.imageURLs.length > 0
                ? product.imageURLs[0]
                : null;

              return (
                <article className="catalog-card" key={id}>
                  <div className="catalog-icon catalog-image">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div className="catalog-image-fallback" style={{ display: image ? "none" : "flex" }}>
                      {(product.category === "iphone" || product.category === "Electronics") ? (
                        <Smartphone size={26} />
                      ) : (
                        <Package size={26} />
                      )}
                    </div>
                    <button
                      className="catalog-delete-btn"
                      title="Delete product"
                      disabled={deletingId === id}
                      onClick={() => handleDelete(product)}
                    >
                      <X size={14} />
                    </button>
                    {product.isFeatured && <span className="status info catalog-featured-badge">Featured</span>}
                  </div>

                  <div className="catalog-card-body">
                    <h3>{product.name}</h3>
                    <p className="catalog-desc">
                      {product.description || "No description available."}
                    </p>
                    <div className="catalog-card-footer">
                      <strong>${Number(product.price).toFixed(2)}</strong>
                      <button
                        className="catalog-edit-btn"
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                        }}
                      >
                        EDIT
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {showForm && (
        <ProductFormModal
          initialData={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export function OffersAdminPage() {
  return (
    <div className="dashboard-view">
      <MiniStats
        items={[
          { label: "Active offers", value: "0", sub: "No API offers loaded", icon: BadgePercent },
          { label: "Redemptions", value: "0", sub: "No campaign data loaded", icon: CheckCircle2 },
          { label: "Discount revenue", value: "$0", sub: "No campaign data loaded", icon: CircleDollarSign },
        ]}
      />
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Offer Campaigns</h2>
            <p>Track discount usage across your live catalog</p>
          </div>
        </div>
        <div className="offer-grid">
          {offers.map((offer) => (
            <article className="offer-card" key={offer.code}>
              <div>
                <span className="offer-code">{offer.code}</span>
                <h3>{offer.name}</h3>
                <p>{offer.value}</p>
              </div>
              <strong>{offer.redemptions} uses</strong>
              <div className="offer-progress"><i style={{ width: `${offer.progress}%` }} /></div>
            </article>
          ))}
          {offers.length === 0 && <div className="catalog-empty">No offer data loaded.</div>}
        </div>
      </section>
    </div>
  );
}

export function InventoryAdminPage() {
  return (
    <div className="dashboard-view">
      <MiniStats
        items={[
          { label: "Units in stock", value: "0", sub: "No inventory data loaded", icon: Boxes },
          { label: "Low stock", value: "0", sub: "No inventory data loaded", icon: Clock3 },
          { label: "Warehouses", value: "0", sub: "No inventory data loaded", icon: Truck },
        ]}
      />
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Inventory Control</h2>
            <p>Stock levels by SKU, category, and warehouse</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="orders-table">
            <thead>
              <tr><th>SKU</th><th>Item</th><th>Category</th><th>Warehouse</th><th>Stock</th><th>Status</th></tr>
            </thead>
            <tbody>
              {inventoryRows.map((item) => (
                <tr key={item.sku}>
                  <td>{item.sku}</td><td>{item.item}</td><td>{item.category}</td><td>{item.warehouse}</td><td>{item.stock}</td>
                  <td><span className={`status ${statusClass[item.status]}`}>{item.status}</span></td>
                </tr>
              ))}
              {inventoryRows.length === 0 && (
                <tr><td colSpan="6">No inventory data loaded.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const processingCount = orders.filter((order) => ["pending", "processing"].includes(String(order.status || "").toLowerCase())).length;
  const shippedCount = orders.filter((order) => ["shipped", "delivered"].includes(String(order.status || "").toLowerCase())).length;

  useEffect(() => {
    async function loadOrders() {
      const currentUserId = getCurrentUserId();
      const list = await fetchUserOrdersWithLocalFallback(currentUserId);
      setOrders(list);
    }
    loadOrders();
  }, []);

  return (
    <div className="dashboard-view">
      <MiniStats
        items={[
          { label: "Orders today", value: String(orders.length), sub: "From customer history", icon: ShoppingCart },
          { label: "Processing", value: String(processingCount), sub: "Pending or processing", icon: PackageCheck },
          { label: "Shipped", value: String(shippedCount), sub: "Shipped or delivered", icon: Truck },
        ]}
      />
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Order Queue</h2>
            <p>Recent store orders from your API</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="orders-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Product</th><th>Date</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id || order.id}>
                  <td>{String(order._id || order.id || "").slice(-8) || "pending"}</td>
                  <td>{order.user?.email || order.userId || "Customer"}</td>
                  <td>{getOrderItems(order).map((item) => item.product?.name || item.name || item.productName || item.productId || "Product").join(", ")}</td>
                  <td>{formatOrderDate(order.createdAt || order.date)}</td>
                  <td>${getOrderTotal(order).toLocaleString()}</td>
                  <td><span className={`status ${statusClass[order.status] || "warning"}`}>{order.status || "pending"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function SalesAdminPage() {
  return (
    <div className="dashboard-view">
      <MiniStats
        items={[
          { label: "Revenue", value: "$166.6k", sub: "This week", icon: CircleDollarSign },
          { label: "Product sales", value: "$0", sub: "No sales API connected", icon: Smartphone },
          { label: "Growth", value: "$0", sub: "No sales API connected", icon: TrendingUp },
        ]}
      />
      <section className="dashboard-grid two-one">
        <article className="panel wide-panel">
          <div className="panel-head">
            <div>
              <h2>Category Sales</h2>
              <p>Category revenue from connected reporting data</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ border: "0", borderRadius: 8, boxShadow: "0 12px 30px rgba(15, 23, 42, .12)" }} />
              <Line type="monotone" dataKey="iphone" stroke="#14b8a6" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="sneakers" stroke="#38bdf8" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </article>
        <article className="panel">
          <div className="panel-head">
            <div>
              <h2>Units Sold</h2>
              <p>Weekly product movement</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={[
              { name: "iPhones", units: 126 },
              { name: "Sneakers", units: 384 },
              { name: "Bundles", units: 92 },
            ]}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip cursor={{ fill: "rgba(45, 212, 191, .08)" }} />
              <Bar dataKey="units" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </section>
    </div>
  );
}
