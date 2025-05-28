import React from "react";
import {
  BarChart,
  Users,
  ShoppingCart,
  Settings,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
// import "./Dashboard.css";

const Dashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Orders",
      value: "1,234",
      icon: ShoppingCart,
      color: "#3b82f6",
      change: "+12%",
    },
    {
      title: "Customers",
      value: "856",
      icon: Users,
      color: "#10b981",
      change: "+8%",
    },
    {
      title: "Revenue",
      value: "$45,678",
      icon: TrendingUp,
      color: "#f59e0b",
      change: "+23%",
    },
    {
      title: "Reports",
      value: "47",
      icon: FileText,
      color: "#ef4444",
      change: "+5%",
    },
  ];

  const quickActions = [
    {
      title: t("nav.order"),
      description: "Create new order",
      icon: ShoppingCart,
      color: "#3b82f6",
    },
    {
      title: t("dashboard.viewReports"),
      description: "View analytics and reports",
      icon: BarChart,
      color: "#10b981",
    },
    {
      title: t("dashboard.settings"),
      description: "Manage account settings",
      icon: Settings,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">{t("dashboard.title")}</h1>
          <p className="dashboard-welcome">
            {t("dashboard.welcome")}, {user?.name}!
            <span className="dashboard-subtitle">
              Here's what's happening today.
            </span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <div
                  className="stat-icon"
                  style={{
                    backgroundColor: `${stat.color}20`,
                    color: stat.color,
                  }}
                >
                  <IconComponent size={24} />
                </div>
              </div>
              <div className="stat-footer">
                <span
                  className="stat-change positive"
                  style={{ color: stat.color }}
                >
                  {stat.change}
                </span>
                <span className="stat-period">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <div
                  className="stat-icon"
                  style={{
                    backgroundColor: `${stat.color}20`,
                    color: stat.color,
                  }}
                >
                  <IconComponent size={24} />
                </div>
              </div>
              <div className="stat-footer">
                <span
                  className="stat-change positive"
                  style={{ color: stat.color }}
                >
                  {stat.change}
                </span>
                <span className="stat-period">from last month</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2 className="section-title">{t("dashboard.quickActions")}</h2>
      </div>
    </div>
  );
};

export default Dashboard;
