import React from "react";
import { Globe2, MousePointerClick, Search, Share2, TrendingDown, TrendingUp, UsersRound } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const trafficData = [
  { date: "22 Jul", traffic: 8200, returning: 4600 },
  { date: "23 Jul", traffic: 13600, returning: 6100 },
  { date: "24 Jul", traffic: 11200, returning: 5400 },
  { date: "25 Jul", traffic: 21400, returning: 9200 },
  { date: "26 Jul", traffic: 18800, returning: 8300 },
  { date: "27 Jul", traffic: 26800, returning: 10400 },
  { date: "28 Jul", traffic: 31100, returning: 13200 },
  { date: "29 Jul", traffic: 35800, returning: 14800 },
];

const socialData = [
  { date: "21 Sep", social: 1800, paid: 1640 },
  { date: "22 Sep", social: 1510, paid: 1580 },
  { date: "23 Sep", social: 1920, paid: 1490 },
  { date: "24 Sep", social: 1210, paid: 1540 },
  { date: "25 Sep", social: 1630, paid: 1460 },
  { date: "26 Sep", social: 1370, paid: 1600 },
];

const visitorArea = [
  { name: "Direct", value: 31, color: "#2dd4bf" },
  { name: "Organic", value: 29, color: "#67e8f9" },
  { name: "Social", value: 24, color: "#a78bfa" },
  { name: "Referral", value: 10, color: "#fbbf24" },
  { name: "Email", value: 6, color: "#f472b6" },
];

const osData = [
  { name: "Android", value: 28, color: "#fb7185" },
  { name: "iOS", value: 23, color: "#f59e0b" },
  { name: "Windows", value: 19, color: "#fde047" },
  { name: "Linux", value: 14, color: "#22c55e" },
  { name: "Mac", value: 9, color: "#38bdf8" },
  { name: "Others", value: 7, color: "#a78bfa" },
];

const trafficCards = [
  { label: "Total Traffic", value: "59,845", change: "+11%", trend: "up", icon: Globe2 },
  { label: "Social Traffic", value: "14,365", change: "+11%", trend: "up", icon: Share2 },
  { label: "Search Traffic", value: "27,457", change: "+8%", trend: "up", icon: Search },
  { label: "Ad Clicks", value: "18,023", change: "-17%", trend: "down", icon: MousePointerClick },
];

export default function AnalyticsPage() {
  return (
    <div className="dashboard-view">
      <section className="dashboard-grid two-one">
        <article className="panel wide-panel">
          <div className="panel-head">
            <div>
              <h2>Total Traffic</h2>
              <p>Visitors and returning users</p>
            </div>
            <select aria-label="Traffic date range">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="returnFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ border: "0", borderRadius: 8, boxShadow: "0 12px 30px rgba(15, 23, 42, .12)" }} />
              <Area type="monotone" dataKey="traffic" stroke="#14b8a6" strokeWidth={3} fill="url(#trafficFill)" />
              <Area type="monotone" dataKey="returning" stroke="#38bdf8" strokeWidth={2} fill="url(#returnFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <h2>Visitors Area</h2>
              <p>Traffic split by channel</p>
            </div>
            <UsersRound className="muted-icon" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={visitorArea} dataKey="value" cx="50%" cy="50%" outerRadius={88}>
                {visitorArea.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </article>
      </section>

      <section className="metric-grid">
        {trafficCards.map(({ label, value, change, trend, icon: Icon }) => (
          <article className="metric-card compact" key={label}>
            <div className="metric-head">
              <div>
                <span>{label}</span>
                <small>Last 30 days</small>
              </div>
              <div className="metric-icon">
                <Icon size={19} />
              </div>
            </div>
            <strong>{value}</strong>
            <p className={trend === "up" ? "positive" : "negative"}>
              {trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {change}
            </p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid equal analytics-bottom">
        <article className="panel">
          <div className="panel-head">
            <div>
              <h2>Operating System</h2>
              <p>Device mix from all sessions</p>
            </div>
            <select aria-label="Operating system date range">
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="os-layout">
            <ResponsiveContainer width="46%" height={220}>
              <PieChart>
                <Pie data={osData} cx="50%" cy="50%" innerRadius={48} outerRadius={88} dataKey="value">
                  {osData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="os-list">
              {osData.map((item) => (
                <div key={item.name}>
                  <span>
                    <i style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel wide-panel">
          <div className="panel-head">
            <div>
              <h2>Social Media Traffic</h2>
              <p>Social visits compared with paid reach</p>
            </div>
            <span className="delta negative"><TrendingDown size={13} /> -13%</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={socialData}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ border: "0", borderRadius: 8, boxShadow: "0 12px 30px rgba(15, 23, 42, .12)" }} />
              <Line type="monotone" dataKey="social" stroke="#fb7185" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="paid" stroke="#cbd5e1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </article>
      </section>
    </div>
  );
}
