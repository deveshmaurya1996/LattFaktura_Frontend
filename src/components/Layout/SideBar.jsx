import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Receipt,
  Users,
  Building2,
  BookOpen,
  DollarSign,
  FileText,
  CreditCard,
  Tag,
  Package,
  UserPlus,
  Upload,
  HelpCircle,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const menuItems = [
    {
      id: "invoices",
      label: t("sidebar.invoices"),
      icon: Receipt,
      path: "/invoices",
      color: "blue",
    },
    {
      id: "customer-register",
      label: t("sidebar.customer_register"),
      icon: Users,
      path: "/customers",
      color: "teal",
    },
    {
      id: "my-business",
      label: t("sidebar.my_business"),
      icon: Building2,
      path: "/myBusiness",
      color: "green",
    },
    {
      id: "invoice-journal",
      label: t("sidebar.invoice_journal"),
      icon: BookOpen,
      path: "/journal",
      color: "orange",
    },
    {
      id: "price-list",
      label: t("sidebar.price_list"),
      icon: DollarSign,
      path: "/pricelist",
      color: "cyan",
    },
    {
      id: "multiple-invoicing",
      label: t("sidebar.multiple_invoicing"),
      icon: FileText,
      path: "/multiple-invoicing",
      color: "blue",
    },
    {
      id: "unpaid-invoices",
      label: t("sidebar.unpaid_invoices"),
      icon: CreditCard,
      path: "/unpaid",
      color: "blue",
    },
    {
      id: "offer",
      label: t("sidebar.offer"),
      icon: Tag,
      path: "/offers",
      color: "blue",
    },
    {
      id: "inventory-control",
      label: t("sidebar.inventory_control"),
      icon: Package,
      path: "/inventory",
      color: "orange",
    },
    {
      id: "member-invoicing",
      label: t("sidebar.member_invoicing"),
      icon: UserPlus,
      path: "/member-invoicing",
      color: "teal",
    },
    {
      id: "import-export",
      label: t("sidebar.import_export"),
      icon: Upload,
      path: "/import-export",
      color: "blue",
    },
    {
      id: "support",
      label: t("sidebar.support"),
      icon: HelpCircle,
      path: "/support",
      color: "orange",
    },
    {
      id: "logout",
      label: t("sidebar.logout"),
      icon: LogOut,
      pathnibus: "/logout",
      color: "purple",
    },
  ];

  const handleItemClick = (item) => {
    if (item.id === "logout") {
      logout();
    } else {
      navigate(item.path);
    }
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>{t("sidebar.header")}</h2>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.id} className="sidebar-item">
                  <button
                    className={`sidebar-link ${active ? "active" : ""}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="sidebar-icon-wrapper">
                      <div className={active ? "active-dot" : "inactive-dot"} />

                      <div
                        className={`sidebar-icon ${item.color}`}
                        data-active={active}
                      >
                        <IconComponent size={18} />
                      </div>
                    </div>
                    <span className="sidebar-text">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
