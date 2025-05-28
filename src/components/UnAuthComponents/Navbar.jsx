import { useState } from "react";

import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../constants/links";
import "./navbar.css";

const Navbar = () => {
  const { language, changeLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { key: "home", label: t("nav.home") },
    { key: "order", label: t("nav.order") },
    { key: "ourCustomers", label: t("nav.ourCustomers") },
    { key: "aboutUs", label: t("nav.aboutUs") },
    { key: "contactUs", label: t("nav.contactUs") },
  ];

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setShowLangDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={images.logo} alt="Logo" className="logo-img" />
          {/* <span className="logo-text">{t("footer.company")}</span> */}
        </div>

        <div className="nav-right">
          <div className="nav-items desktop-nav">
            {navItems.map((item) => (
              <Link key={item.key} href="#" className="nav-link">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="lang-selector">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="lang-button"
            >
              <span className="nav-link">
                {language === "en" ? "English" : "Svenska"}
              </span>

              {language === "en" ? (
                <img src={images.gb} alt="English Flag" className="flag-img" />
              ) : (
                <img src={images.se} alt="Swedish Flag" className="flag-img" />
              )}
            </button>

            {showLangDropdown && (
              <div className="lang-dropdown">
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`lang-option ${language === "en" ? "active" : ""}`}
                >
                  <p>English</p>
                  <img
                    src={images.gb}
                    alt="English Flag"
                    className="flag-img"
                  />
                </button>
                <button
                  onClick={() => handleLanguageChange("sv")}
                  className={`lang-option ${language === "sv" ? "active" : ""}`}
                >
                  <p>Svenska</p>
                  <img
                    src={images.se}
                    alt="Swedish Flag"
                    className="flag-img"
                  />
                </button>
              </div>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="mobile-nav">
          {navItems.map((item) => (
            <a key={item.key} href="#" className="mobile-nav-link">
              {item.label}
            </a>
          ))}
          {user && (
            <button onClick={logout} className="mobile-logout-btn">
              {t("nav.logout")}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
