import React from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  Boxes,
  Clock3,
  PackageCheck,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { day: "Mon", revenue: 18500, orders: 72 },
  { day: "Tue", revenue: 24200, orders: 86 },
  { day: "Wed", revenue: 21800, orders: 78 },
  { day: "Thu", revenue: 35600, orders: 112 },
  { day: "Fri", revenue: 44200, orders: 137 },
  { day: "Sat", revenue: 38100, orders: 121 },
  { day: "Sun", revenue: 51600, orders: 154 },
];

const sourceData = [
  { name: "Organic", value: 35, color: "#2dd4bf" },
  { name: "Social", value: 26, color: "#38bdf8" },
  { name: "Direct", value: 22, color: "#a78bfa" },
  { name: "Referral", value: 17, color: "#f59e0b" },
];

const statCards = [
  { label: "Total Revenue", value: "$82,650", sub: "Last 30 days", change: "+11.2%", trend: "up", icon: BadgeDollarSign },
  { label: "Total Orders", value: "1,645", sub: "Last 30 days", change: "+8.4%", trend: "up", icon: ShoppingCart },
  { label: "Customers", value: "1,462", sub: "Active accounts", change: "+5.7%", trend: "up", icon: Users },
  { label: "Pending Orders", value: "118", sub: "Need review", change: "-3.1%", trend: "down", icon: Clock3 },
];

const products = [
  { name: "Nova Pro Headset", stock: "752 sold", fill: 86 },
  { name: "Aero Smart Watch", stock: "680 sold", fill: 78 },
  { name: "Volt Mini Speaker", stock: "620 sold", fill: 71 },
  { name: "Luma Desk Lamp", stock: "590 sold", fill: 64 },
];

const recentOrders = [
  { id: "#ORD-2401", customer: "Sarah Miller", product: "Nova Pro Headset", amount: "$240", status: "Delivered" },
  { id: "#ORD-2402", customer: "James Obi", product: "Aero Smart Watch", amount: "$185", status: "Processing" },
  { id: "#ORD-2403", customer: "Amara Diallo", product: "Volt Mini Speaker", amount: "$320", status: "Shipped" },
  { id: "#ORD-2404", customer: "Lena Park", product: "Luma Desk Lamp", amount: "$210", status: "Pending" },
];

const campaigns = [
  { label: "Summer discount", progress: 72, color: "#2dd4bf" },
  { label: "First order coupon", progress: 58, color: "#38bdf8" },
  { label: "Bundle checkout", progress: 84, color: "#a78bfa" },
];

const statusClass = {
  Delivered: "success",
  Processing: "info",
  Shipped: "accent",
  Pending: "warning",
};

export default function OverviewPage() {
  return (
    <div className="dashboard-view">
      <section className="metric-grid">
        {statCards.map(({ label, value, sub, change, trend, icon: Icon }) => (
          <article className="metric-card" key={label}>
            <div className="metric-head">
              <div>
                <span>{label}</span>
                <small>{sub}</small>
              </div>
              <div className="metric-icon">
                <Icon size={20} />
              </div>
            </div>
            <strong>{value}</strong>
            <p className={trend === "up" ? "positive" : "negative"}>
              {trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {change} vs last month
            </p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid two-one">
        <article className="panel wide-panel">
          <div className="panel-head">
            <div>
              <h2>Sales Analytics</h2>
              <p>Revenue and order volume this week</p>
            </div>
            <select aria-label="Sales date range">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ border: "0", borderRadius: 8, boxShadow: "0 12px 30px rgba(15, 23, 42, .12)" }} />
              <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} fill="url(#revenueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <h2>Visitors Area</h2>
              <p>Traffic source share</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={48} outerRadius={88} dataKey="value" paddingAngle={2}>
                {sourceData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend-grid">
            {sourceData.map((item) => (
              <span key={item.name}>
                <i style={{ backgroundColor: item.color }} />
                {item.name} {item.value}%
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-grid equal">
        <article className="panel">
          <div className="panel-head">
            <div>
              <h2>Top Selling Products</h2>
              <p>Best performers this month</p>
            </div>
            <button className="text-button" type="button">
              View all <ArrowRight size={15} />
            </button>
          </div>
          <div className="product-list">
            {products.map((product) => (
              <div className="product-row" key={product.name}>
                <div className="product-thumb">
                  <PackageCheck size={20} />
                </div>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.stock}</span>
                </div>
                <div className="mini-progress" aria-label={`${product.name} progress`}>
                  <i style={{ width: `${product.fill}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <h2>Inventory Snapshot</h2>
              <p>Stock pressure by category</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={235}>
            <BarChart data={[
              { category: "Audio", stock: 88 },
              { category: "Wear", stock: 72 },
              { category: "Home", stock: 64 },
              { category: "Tech", stock: 51 },
            ]}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip cursor={{ fill: "rgba(45, 212, 191, .08)" }} />
              <Bar dataKey="stock" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <h2>Current Offers</h2>
              <p>Campaign completion</p>
            </div>
            <Boxes size={20} className="muted-icon" />
          </div>
          <div className="campaign-list">
            {campaigns.map((campaign) => (
              <div key={campaign.label}>
                <div>
                  <span>{campaign.label}</span>
                  <strong>{campaign.progress}%</strong>
                </div>
                <div className="offer-progress">
                  <i style={{ width: `${campaign.progress}%`, backgroundColor: campaign.color }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Recent Orders</h2>
            <p>Latest customer checkout activity</p>
          </div>
          <button className="text-button" type="button">
            View all <ArrowRight size={15} />
          </button>
        </div>
        <div className="table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`status ${statusClass[order.status]}`}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
