import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, List, Plus, Star } from "lucide-react";
import "./AuthNavbar.css";
import { useLanguage } from "../../contexts/LanguageContext";
import { images } from "../../constants/links";
import { useProductContext } from "../../contexts/ProductContext";

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("new-product");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { setIsCreating } = useProductContext();
  const topNavItems = [
    { id: "new-product", label: t("authNavbar.new_product"), icon: Plus },
    { id: "print-list", label: t("authNavbar.print_list"), icon: List },
    { id: "advance-mode", label: t("authNavbar.advance_mode"), icon: Star },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "new-product") {
      setIsCreating(true);
    } else {
      navigate(`/${tabId}`);
    }
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <nav className="auth-navbar">
      <div className="auth-navbar-container">
        {/* Left section with logo and hamburger */}
        <div className="auth-navbar-left">
          <button
            className="hamburger-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="auth-navbar-logo" onClick={() => navigate("/")}>
            <img src={images.logo} alt="Logo" className="logo-img" />
          </div>
        </div>

        {/* Center section with navigation tabs */}
        <div className="auth-navbar-center">
          <div className="auth-nav-tabs">
            {topNavItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  className={`auth-nav-tab ${
                    activeTab === item.id ? "active" : ""
                  }`}
                  onClick={() => handleTabClick(item.id)}
                >
                  <span>{item.label}</span>
                  <IconComponent size={16} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right section with language selector */}
        <div className="auth-navbar-right">
          <div className="language-selector">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="language-btn"
            >
              <span className="language-text">
                {language === "en" ? "English" : "Svenska"}
              </span>

              {language === "en" ? (
                <img src={images.gb} alt="English Flag" className="flag-img" />
              ) : (
                <img src={images.se} alt="Swedish Flag" className="flag-img" />
              )}
            </button>

            {isLanguageDropdownOpen && (
              <div className="language-dropdown">
                <button
                  className="language-option"
                  onClick={() => handleLanguageChange("en")}
                >
                  <span>English</span>
                  <img
                    src={images.gb}
                    alt="English Flag"
                    className="flag-img"
                  />
                </button>
                <button
                  className="language-option"
                  onClick={() => handleLanguageChange("sv")}
                >
                  <span>Svenska</span>
                  <img
                    src={images.se}
                    alt="Swedish Flag"
                    className="flag-img"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
